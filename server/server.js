var express           = require('express');
var topdomains        = require('./topdomains');
var applications      = require('./models/applications');
var nconf             = require('./config/nconf');
var crypto            = require('crypto');
var biguint           = require('biguint-format');
var mandrill          = require('./mandrill');
var Recaptcha         = require('recaptcha').Recaptcha;

var app           = express();
var host          = nconf.get('HOST');
var port          = nconf.get('PORT');
var SSL           = nconf.get('SSL');

var rippleDestinationAddress = '1234567890abcdefgh';
var ripplePayAmount = 100; // XRP

var CAPTCHA_PRIVATE_KEY = process.env.CAPTCHA_PRIVATE_KEY;
var CAPTCHA_PUBLIC_KEY = nconf.get('CAPTCHA_PUBLIC_KEY');

// if true so always
if (true || 'development' === process.env.NODE_ENV || 'test' === process.env.NODE_ENV) {
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
}

// set up middleware
app.disable('x-powered-by');

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.static(__dirname + '/../client/app'));
app.use(express.bodyParser());


// set up routing

// for heroku ssl forwarding
if ('heroku' === process.env.SERVICE_PLATFORM && SSL) {
  app.all('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https') {
      res.send(400, {error: 'use SSL'});
    } else {
      next(); /* Continue to other routes if we're not redirecting */
    }
  });
}


app.post('/v1/application', function(req, res){

  var captchaData = {
    remoteip:  req.connection.remoteAddress,
    challenge: req.body.captcha.challenge,
    response:  req.body.captcha.response
  };

  var recaptcha = new Recaptcha(CAPTCHA_PUBLIC_KEY, CAPTCHA_PRIVATE_KEY, captchaData);

  recaptcha.verify(function(success, error_code) {
    if(success){

      //Delete captcha object before storing in database
      delete req.body.captcha;
      createApplication(req.body, function(err, application) {
        if (err) {
          respondError(res, err);
        } else {
          respondSuccess(res, 'application', application);

          emailOpts = application;
          emailOpts.payment_to_address = rippleDestinationAddress;
          emailOpts.payment_amount = ripplePayAmount;
          emailOpts.payment_client_url = constructClientPayUrl(rippleDestinationAddress, application.destination_tag, ripplePayAmount);

          mandrill.applicationReceived(emailOpts, function(error, result) {
            console.log('|| mandril send:', error ? JSON.stringify(error) : error, result ? JSON.stringify(result) : result);
          });
        }
      });
    } else {
      res.json({captchaError: true, error: error_code});
    }
  });



});

app.get('/v1/validate', function(req, res) {
  if (!topdomains.contains(req.query.ripple_name)) {
    respondSuccess(res);
  } else {
    respondError(res, 'domain exists', undefined, 200);
  }

});


function constructClientPayUrl(destinationAddress, destinationTag, amount) {
  return ['https://ripple.com//send?to=', destinationAddress, '&dt=', destinationTag ,'&amount=', amount].join('');
}

function respondSuccess(res, propertyName, property, statusCode) {

  var response =
  {
    success: true
  };

  if (propertyName) {
    response[propertyName] = property;
  }
  res.json(statusCode ? statusCode : 200, response);
}

function respondError(res, error, message, statusCode) {
  var response =
  {
    success: false,
    error: error,
  };

  if (message) {
    response.message = message;
  }

  res.json(statusCode ? statusCode : 500, response);
}


function createApplication(opts, fn) {
  console.log('|| createApplication:', JSON.stringify(opts));


  // generate destination tag
  opts.destination_tag = biguint(crypto.randomBytes(4), 'dec');

  var model = applications.build(opts);
  var errors = model.validate();
  console.log('post', opts);
  if (topdomains.contains(opts.ripple_name)) {
    var rippleNameError = ['Validation popular domain failed: ripple_name'];
    if (errors) {
      errors.ripple_name = rippleNameError;
    } else {
      errors = {
        ripple_name : rippleNameError
      }
    }
  }

  if (errors) {
    fn(errors, null);
  } else {
    model.save().complete(function(err, application){
      if (!err && application) {
        fn(null, application.toJSON());
      } else {
        var error = JSON.parse(JSON.stringify(err));
        fn(error, null);
      }
    });
  }


  // TODO: enable if we want to enforce feedback on paid applications
  // var fn = function(error, appliction) {
  //   // do something!
  // };

  // // check if there was another application that was already payed
  // findPaidApplicationsWithName(name, function(err, application) {
  //   if (err) {
  //       fn(err, null);
  //     } else if (application) {
  //       // a paid authorization has been found
  //     } else {
  //       // no paid application with name has been found, we're all good to go
  //     }
  //   });
  // });



};

function findPaidApplicationsWithName(name, fn) {
  applications.find({
    where: ['paid=? and ripple_name=?', true, name]
  }).complete(fn);
}


// boot

if (host) {
  app.listen(host, port);
} else {
  app.listen(port);
}

console.log('Serving ' + (nconf.get('SSL') ? 'HTTPS' : 'HTTP') + ' on ' + (host || 'localhost') + ':' + port);



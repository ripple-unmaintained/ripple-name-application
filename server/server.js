var express           = require('express');
var applications      = require('./models/applications');
var nconf             = require('./config/nconf');

var app           = express();
var host          = nconf.get('HOST');
var port          = nconf.get('PORT');
var SSL           = nconf.get('SSL');

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

app.use(express.static(__dirname + '/../client'));
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
  console.log(req.get('User-Agent'));
  console.log(req.body);

  createApplication(req.body, function(err, application) {
    if (err) {
      respondError(res, err);
    } else {
      respondSuccess(res, 'application', application);
    }
  });

});


function respondSuccess(res, propertyName, property, statusCode) {

  var response =
  {
    success: true
  };

  response[propertyName] = property;
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
  console.log(opts);

  var model = applications.build(opts);
  var errors = model.validate();

  console.log(errors);

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

};


// boot

if (host) {
  app.listen(host, port);
} else {
  app.listen(port);
}

console.log('Serving ' + (nconf.get('SSL') ? 'HTTPS' : 'HTTP') + ' on ' + (host || 'localhost') + ':' + port);



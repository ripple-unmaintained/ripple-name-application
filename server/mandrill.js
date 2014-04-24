var config      = require('./config/nconf');
var mandrill    = require('mandrill-api/mandrill');
var handlebars  = require('handlebars');
var fs          = require("fs");

var Email = function () {
  var mandrill_key = config.get('MANDRILL_KEY');
  if (!mandrill_key) {
    console.error("MANDRILL key is missing, no mails can be send");
    return;
  }

  this.mandrill_client = new mandrill.Mandrill(mandrill_key);

  function template(filename, data) {

    try {
      var source = fs.readFileSync(__dirname + '/mail/' + filename, "utf8");
      var compiled = handlebars.compile(source);
      return compiled(data);
    } catch (e) {
      // No file
      return null;
    }
  }

  this.mandrillSend = function (message, callback) {
    var async = false;
    var ip_pool = "Main Pool";
    this.mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        //console.log(result);
        callback(null, result);
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        callback(e, null);
    });
  };

  this.sendEmail = function (email, subject, filename, data, callback) {

    // Generic email
    var message = {
        "text": template(filename + '.txt', data),
        "subject": subject,
        "from_email": "support@ripple.com",
        "from_name": "Ripple Name Application",
        "to": [{
                "email": email,
                "name": data.full_name,
                "type": "to"
            }],
        "headers": {
            "Reply-To": "support@ripple.com"
        }
    };

    // Only add HTML when available
    var html = template(filename + '.html', data);
    if (html) message.html = html;

    this.mandrillSend(message, callback);
  };
};

Email.prototype.applicationReceived = function (opts, callback) {
  var email = opts.email;
  var subject = 'Ripple name application received';
  var filename = 'application_received';
  var data = opts;
  this.sendEmail(email, subject, filename, data, callback);
};


// export singleton
module.exports = new Email();
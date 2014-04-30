var fs              = require('fs');
var json2csv        = require('json2csv');
var applications    = require('./models/applications');


var readApplications = function() {

  applications.findAll({}).complete(function(err, applications) {

    var sanitized = [];
    var fields;

    for (var i=0; i<applications.length; i++) {
      var application = applications[i].dataValues;
      sanitized.push(application);
      if (i===0) {
        fields = Object.keys(application);
      }
    }

    // save full information
    json2csv({data: sanitized, fields: fields}, function(err, csv) {
      if (err) {
        console.log(err);
        return;
      }
      fs.writeFile('name_applications_full.csv', csv, function(err) {
        if (err) {
          throw err;
        }
        console.log('name_applications_full.csv saved');
      });
    });

    var shortFields = ['ripple_name','website'];

    // save name and domain
    json2csv({data: sanitized, fields: shortFields}, function(err, csv) {
      if (err) {
        console.log(err);
        return;
      }

      fs.writeFile('name_applications.csv', csv, function(err) {
        if (err) {
          throw err;
        }
        console.log('name_applications.csv saved');
      });
    });

  });

};

readApplications();
var nconf = require('nconf');

nconf
  .env()
  .file({ file: './config/config.json' });

nconf.defaults({
  'SSL': true,
  'PORT': 4900,
  'CAPTCHA_PUBLIC_KEY': '6LdEJfISAAAAAMYNSPq0RwTDBTOPxh8d40u744GJ'
});

module.exports = nconf;
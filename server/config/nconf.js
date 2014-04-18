var nconf = require('nconf');

nconf
  .env()
  .file({ file: './config/config.json' });

nconf.defaults({
  'SSL': true,
  'PORT': 4900,
});

module.exports = nconf;
var fs  = require('fs');
var csv = require('csv');

var TopDomains = function () {

  this.domains = [];
  _domains = this.domains;

  // read in the top domain names
  var csvReader = csv().from.path(__dirname+'/top-1m.csv', { delimiter: ',', escape: '"' });
  csvReader
    .on('record', function(row,index){
      if (index < 100 * 1000) {
        _domains.push(row[1].split('.')[0]);
      } else if (index === 100 * 1000 + 1) {
        console.log('[domains] done ...');
      }
    })
    .on('end', function(count){
      console.log('[domains] ... and done.');
    })
    .on('error', function(error){
      console.log(error.message);
    });

};

TopDomains.prototype.contains = function(domain) {
  if (this.domains.indexOf(domain) > -1) {
    return true;
  }
  return false;
}

// export singleton
module.exports = new TopDomains();
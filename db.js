const Datastore = require('nedb')
let exifCollection = new Datastore({ fileName : 'database', autoload: true, timestampData : true })
const bluebird = require('bluebird');

exifCollection = bluebird.promisifyAll(exifCollection);

module.exports = {
  db : Datastore,
  exifCollection : exifCollection
};

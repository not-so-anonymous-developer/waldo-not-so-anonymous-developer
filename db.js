const Datastore = require('nedb')
let exifCollection = new Datastore({ filename:'database', autoload: true, timestampData : true })
const bluebird = require('bluebird');

exifCollection = bluebird.promisifyAll(exifCollection);
exifCollection.count({}, (err, count) =>{
  if (err) return console.error(err);
  console.log('Total Image EXIFs currently stored: ' + count);
});

module.exports = {
  db : Datastore,
  exifCollection : exifCollection
};

const Datastore = require('nedb')
let exifCollection = new Datastore({ filename:'database', autoload: true, timestampData : true })
const bluebird = require('bluebird');

exifCollection = bluebird.promisifyAll(exifCollection);
exifCollection.find({}, (err, docs) => {
  console.log(docs.length);
});
module.exports = {
  db : Datastore,
  exifCollection : exifCollection
};

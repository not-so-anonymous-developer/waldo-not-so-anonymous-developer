const s3 = require('./s3');
const { getExif, parseExifStream, storeExif } = require('./clients/exif_client');
const bucketName = 'waldo-recruiting';
const { parallelLimit } = require('async');
const Promise = require('bluebird');
const { exifCollection } = require('./db');

function init() {
  getAllAndUpsertFromS3();
}

function getAllAndUpsertFromS3() {
  s3.listObjects({}, (err,data) => {
    if (err) {
      console.error(err);
    }
    const objects = data.Contents;
    try {
      Promise.map(objects, (obj)  => {
        return getExif(obj)
          .spread(parseExifStream)
          .spread(storeExif)
          .catch(console.error);
      }, {concurrency: 5})
      .then(() => console.log('all done'))
      .then(() => {
        exifCollection.find({}, (err, docs) =>{
          if (err) return console.error(err);
          console.log(docs.length);
        });
      })
      .catch(console.error);
    } catch (ex) {
      console.error('key: ' + ex.key);
      console.error(ex);
    }

    //Promise.all(exifPromises)

  })
}
module.exports = {
  init : init
}

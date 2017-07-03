const s3 = require('./s3');
const { getExif, parseExifStream, storeExif } = require('./exif_client');
const bucketName = 'waldo-recruiting';
const { parallelLimit } = require('async');
const Promise = require('bluebird');
const { exifCollection } = require('./db');

function init() {
  return getAllAndUpsertFromS3();
}

function getAllAndUpsertFromS3() {
  s3.listObjects({}, (err,data) => {
    if (err) {
      console.error(err);
    }
    const objects = data.Contents.slice(50,60);
    try {
      Promise.map(objects, (obj)  => {
        return getExif(obj)
          .spread(parseExifStream)
          .spread(storeExif)
          .catch(console.error);
      }, {concurrency: 6})
      .then(() => console.log('all done'))
      .then(() => {
        exifCollection.count({}, (err, count) =>{
          if (err) throw err;
          console.log('Total Image EXIFs currently stored:' + count);
        });
      })
      .catch((ex) => {
        console.error('key: ' + ex.key);
        console.error(ex.message);
      });
    } catch (ex) {
      console.error('key: ' + ex.key);
      console.error(ex.message);
    }

  })
}
module.exports = {
  init
};

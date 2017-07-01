const s3 = require('./s3');
const { getAndStoreExif } = require('./clients/exif_client');
const bucketName = 'waldo-recruiting';
const { parallelLimit } = require('async');
const Promise = require('bluebird');

function init() {
  getAllAndUpsertFromS3();
}

function getAllAndUpsertFromS3() {
  s3.listObjects({}, (err,data) => {
    if (err) {
      console.error(err);
    }
    const objects = data.Contents.slice(0,10);
    try {
      Promise.map(objects, (obj)  => {
        console.log('mapping promise');
        return getAndStoreExif(obj);
      }, {concurrency: 3})
      .then(() => console.log('all done'))
      .catch(() => console.log('failure'));
    } catch (ex) {
      console.error(ex);
    }

    //Promise.all(exifPromises)

  })
}
module.exports = {
  init : init
}

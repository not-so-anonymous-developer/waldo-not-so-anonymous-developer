const s3 = require('../s3');
const { exifCollection } = require('../db');
const JPEGDecoder = require('jpg-stream/decoder');
const request = require('request-promise');

function getAndStoreExif(s3Obj) {
  const key = s3Obj.Key;

  //quick hack to stop us from trying to parse non-jpegs...
  if (!key.endsWith(".jpg")) {
    console.log('skipping non jpg');
    return Promise.resolve();
  }
  const decoder = new JPEGDecoder;
  const data = {
    etag : s3Obj.ETag
  };

  try {
    let fetchedObj = s3.getObject({
      Key : key
    });
    return request('http://s3.amazonaws.com/waldo-recruiting/' + key)
    .pipe(decoder)
    .on('meta', meta => {
      data.exif = meta;
      console.log('got meta!');
      return exifCollection.updateAsync({ _id: key }, data, { upsert: true });
    }).on('error', error => {
      console.err('key :' + key + " had issues...");
      console.error(error);
      return Promise.reject(ex);
    });
  } catch (ex) {
    console.err('key :' + key + " had issues...");
    console.error(ex);
    return Promise.reject(ex);
  }
}


module.exports = {
  getAndStoreExif : getAndStoreExif
};

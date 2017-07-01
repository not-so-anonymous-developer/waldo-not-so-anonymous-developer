const s3 = require('../s3');
const { exifCollection } = require('../db');
const JPEGDecoder = require('jpg-stream/decoder');
const request = require('request-promise');

function getExif(s3Obj) {
  const key = s3Obj.Key;

  //quick hack to stop us from trying to parse non-jpegs...
  if (!key.endsWith(".jpg")) {
    console.log('skipping non jpg');
    return Promise.reject(new Error("Unsupported Filetype"));
  }

  try {
    return request('http://s3.amazonaws.com/waldo-recruiting/' + key).then((resp) => {
      return [resp, key];
    }));
  } catch (ex) {
    console.err('key :' + key + " had issues...");
    console.error(ex);
    return Promise.reject(ex);
  }
}

function parseExifStream(res, key){
  const decoder = new JPEGDecoder;
  return res.pipe(decoder)
  .on('meta', meta => {
    data.exif = meta;
    console.log('got meta!');
    return meta;
  }).on('error', error => {
    console.err('key :' + key + " had issues...");
    console.error(error);
    return Promise.reject(ex);
  });
}

function storeExif(exif, key) {

}


module.exports = {
  getAndStoreExif : getAndStoreExif,
  parseExifStream : parseExifStream,
  storeExif : storeExif
};

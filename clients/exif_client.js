const s3 = require('../s3');
const { exifCollection } = require('../db');
const JPEGDecoder = require('jpg-stream/decoder');
const request = require('request');
const Promise = require('bluebird');

function getExif(s3Obj) {
  const key = s3Obj.Key;
  const identifiers = {
    key : key,
    etag : s3Obj.ETag
  }

  //quick hack to stop us from trying to parse non-jpegs...
  if (!key.endsWith(".jpg")) {
    let err = new Error("Unsupported Filetype");
    err.key = key;
    return Promise.reject(err);
  }

  try {
    return Promise.resolve([request('http://s3.amazonaws.com/waldo-recruiting/' + key), identifiers]);
  } catch (ex) {
    let err = new Error("Request for Image Failed");
    err.key = key;
    return Promise.reject(ex);
  }
}

function parseExifStream(res, identifiers){
  try {
    return new Promise((resolve, reject) => {
      res.on('error', error => {
        let err = new Error("Request for Image Failed");
        err.key = identifiers.key;
        reject(err);
      })
      .on('response', function(res) {
        console.log("key:" + identifiers.key);
        const contentType = res.headers['content-type'];
        switch (res.statusCode) {
          case 200: break;
          case 404: return reject(new Error("Image Not Found"));
          default: return reject(new Error("Unknown Server Error"));
        }
        switch (contentType) {
          case 'image/jpeg': return _decodeJPEG(resolve, reject, res, identifiers);
          //case 'image/png': return reject(new Error('PNG unsupported'));
          default: return reject(new Error('Unsupported Content Type:' + contentType));
        }
      })
    });
  } catch (ex) {
    ex.key = identifiers.key;
    return Promise.reject(ex);
  }

}

function storeExif(exif, identifiers) {
  const data = {
    _id : identifiers.key,
    exif : exif,
    etag : identifiers.etag
  };
  return exifCollection.updateAsync({ _id: identifiers.key },
    data, { upsert: true }).then(() => {
      console.log('storing with etag:'  + identifiers.etag);
    }).catch((err) => {
      err.key = identifiers.key;
      return Promise.reject(err);
    });
}

function _decodeJPEG(resolve, reject, res, identifiers) {
  const decoder = new JPEGDecoder;
  res
  .pipe(decoder)
  .on('meta', meta => {
    resolve([meta,identifiers]);
  }).on('error', error => {
    let err = new Error("Decoding failed?");
    err.key = identifiers.key;
    reject(err);
  });
}

function _decodePNG() {
  //TODO: impl
}


module.exports = {
  getExif : getExif,
  parseExifStream : parseExifStream,
  storeExif : storeExif
};

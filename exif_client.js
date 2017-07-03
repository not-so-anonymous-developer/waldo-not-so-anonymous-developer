const s3 = require('./s3');
const { exifCollection } = require('./db');
const JPEGDecoder = require('jpg-stream/decoder');
const request = require('request');
const Promise = require('bluebird');
const sharp = require('sharp');
const exifReader = require('exif-reader');
const { RequestError, UnknownError,
  DecodingError, UnsupportedFormatError } = require('./errors');

function getExif(key) {
  const identifiers = {
    key : key
  }

  try {
    return Promise.resolve([request('http://s3.amazonaws.com/waldo-recruiting/' + key), identifiers]);
  } catch (ex) {
    let err = new RequestError(ex.message, key);
    return Promise.reject(ex);
  }
}

function parseExifStream(res, identifiers){
  const key = identifiers.key;
  try {
    return new Promise((resolve, reject) => {
      res.on('error', error => {
        let err = new UnknownError(ex.message, key);
        reject(err);
      })
      .on('response', function(res) {
        console.log("processing key:" + key);
        identifiers.etag = res.headers.ETag;
        const contentType = res.headers['content-type'] || '';
        switch (res.statusCode) {
          case 200: break;
          default: return reject(new RequestError("Request Error", key, res));
        }
        //check content-type for img, or atleast see if its "trying" to be an image.
        if (contentType.startsWith('image') || key.endsWith('.jpg')) {
          return _decode(resolve, reject, res, identifiers);
        } else {
          return reject(new UnsupportedFormatError('Unsupported Content Type.', key, contentType));
        }
      });
    });
  } catch (ex) {
    return Promise.reject(new UnknownError(ex.message, key));
  }

}

function storeExif(metadata, identifiers) {
  const key = identifiers.key;
  const data = {
    _id : key,
    metadata : metadata,
    etag : identifiers.etag
  };
  return exifCollection.updateAsync({ _id: key },
    data, { upsert: true }).then(() => {
      console.log('storing with key:'  + key);
    }).catch((err) => {
      return Promise.reject(new UnknownError(ex.message, key));
    });
}

function _decode(resolve, reject, res, identifiers) {
  const key = identifiers.key;
  const metadataTransformer = sharp().metadata(function (err, meta){
    if (err) {
      return reject(new DecodingError(ex.message, key));
    }
    let metaSubset = {
      decoder : meta.format
    };
    if (meta.exif) {
      metaSubset.exif = exifReader(meta.exif);
    }
    resolve([metaSubset,identifiers]);
  });
  res.pipe(metadataTransformer)
  .on('error', error => {
    reject(new DecodingError(error.message, key));
  });
}


module.exports = {
  getExif,
  parseExifStream,
  storeExif
};

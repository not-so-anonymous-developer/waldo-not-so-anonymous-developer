const { exifCollection } = require ('./db.js');
const { getExif, parseExifStream, storeExif } = require ('./exif_client');
const { RequestError, UnknownError, DecodingError, UnsupportedFormatError } = require('./errors');
const _ = require('lodash');
const s3 = require('./s3');

function handleGetExif(req, res) {
  let photoHash = req.params.id;
  let exifAttribute = req.params.attr;
  console.log('requested exif of ' + photoHash);
  if (exifAttribute) {
    console.log('with EXIF Attribute: ' + exifAttribute);
  }
  exifCollection.findOneAsync({ _id : photoHash}).then((doc) => {
    if (doc) {
      let metadata = doc.metadata;
      console.log(photoHash + ' found, retreiving...');
      if (exifAttribute) {
        getExifAttrValue(res, metadata, exifAttribute);
      } else {
        res.json(metadata);
      }
    } else {
      console.log(photoHash + " not found in db, trying to retrieve");
      //lets check S3 to see if it exists.
      let parsedExifPromise = getExif(photoHash)
        .spread(parseExifStream)
        //Let's send the response AND store it.
        .spread(sendNewlyRetrievedExif(res))
        .spread(storeExif)
        .catch(RequestError, (ex) => {
          //simple pass through, but we can easily program this to be more specific.
          res.status(ex.statusCode);
          console.error(ex);
          return res.send("S3 storage responded with a " +  ex.statusCode + " HTTP status code.")
        })
        .catch(UnsupportedFormatError, (ex) => {
          res.status(500);
          console.error(ex);
          return res.send('Image format type is unsupported');
        })
        .catch(DecodingError, (ex) => {
          res.status(500);
          console.error(ex);
          return res.send('An error occured trying to decode the image.');
        })
        .catch(handleUnknownError);
    }
  }).catch(handleUnknownError);

  function handleUnknownError(ex) {
    res.status(500);
    console.error(ex);
    return res.send('Unknown error has occured. Please contact the developer.');
  };
}

function handleGetExifValue(req, res) {

}



function sendNewlyRetrievedExif(res, exifAttribute) {
  return ((metadata,identifiers) => {
    if (exifAttribute) {
      getExifAttrValue(res, metadata, exifAttribute)
    } else {
      res.json(metadata);
    }
    return Promise.resolve([metadata,identifiers])
  });
}

function getExifAttrValue(res, metadata, exifAttribute) {
  exifAttribute = _.replace(exifAttribute, RegExp("/","g"), '.');
  let val = _.get(metadata.exif, exifAttribute);
  if (!val) {
    res.status(400);
    res.send('Exif Attribute: ' + exifAttribute + ' not found.')
  } else {
    res.json(val);
  }
}

function getImageList(req, res) {
  s3.listObjects({}, (err,data) => {
    if (err) {
      console.error(err);
    }
    const objects = data.Contents;
    objects.forEach((obj) => {
      obj.href = '/exif/' + obj.Key;
    });
    res.json(objects);
  });
}




module.exports = {
  getExif : handleGetExif,
  getImageList
};

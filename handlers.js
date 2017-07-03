const { exifCollection } = require ('./db.js');
const { getExif, parseExifStream, storeExif } = require ('./exif_client');
const { RequestError, UnknownError,
  ParseError, UnsupportedFormatError } = require('./errors');

function handleGetExif (req, res) {
  let photoHash = req.params.id;
  console.log('requested exif of ' + photoHash);
  exifCollection.findOneAsync({ _id : photoHash}).then((doc) => {
    console.log ('got doc');
    console.log(doc);
    if (doc) {
      return doc.exif;
    } else {
      //lets check S3 to see if it exists.
      let parsedExifPromise = getExif(photoHash)
        .spread(parseExifStream)
        .catch(RequestError, (ex) => {
          //simple pass through, but we can easily program this to be more specific.
          res.Status(ex.statusCode);
          return res.send("S3 storage responded with a " +  res.statusCode + " HTTP status code.")
        })
        .catch(UnsupportedFormatError, (ex) => {
          res.status(500);
          return res.send('Image format type is unsupported');
        })
        .catch(DecodingError, (ex) => {
          res.status(500);
          return res.send('An error occured trying to decode the image.');
        })
        .catch((ex) => {
          res.status(500);
          return res.send('Unknown error has occured. Please contact the developer.');
        });
      //Let's send the response AND store it.
      parsedExifPromise.spread(sendParsedExif(res))
      parsedExifPromise.spread(storeExif);
    }
  }).catch((ex) => {
    res.status(500);
    return res.send('Unknown error has occured. Please contact the developer.');
  });
}

function handleGetExifValue(req, res) {

}

function sendParsedExif(res) {
  return ((metaSubset,identifiers) => {
    return res.json(metaSubset);
  });
}

function formatExif() {

}

module.exports = {
  getExif : handleGetExif,
  getExifValue : handleGetExifValue
};

const { exifCollection } = require ('../db.js');

function getExif (photoHash) {
  let exif = exifCollection.findOne({ _id : photoHash});
  if (!exif) {

  }
}

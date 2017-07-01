const { exifCollection } = require ('../db.js');

function getExif (photoHash) {
  let exif = exifCollection.get(photoHash);
  if (!exif) {

  }
}

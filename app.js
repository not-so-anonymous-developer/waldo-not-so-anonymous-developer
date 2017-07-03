//require('./init-db').init();
const express = require('express');
const app = express();
const { getExif, getExifValue } = require('./handlers');

app.get('/exif/:id', getExif);

app.listen(3000, () => {
  console.log('API server started');
});

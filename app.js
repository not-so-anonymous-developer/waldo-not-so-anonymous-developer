const program = require('commander');
const express = require('express');
const app = express();
const { getExif, getImageList } = require('./handlers');

program
  .version('1.0.0_BETA')
  .option('-i, --init', 'Fully update the database with EXIF info from S3')
  .option('-p, --port', 'Port to run the HTTP API/Express on.', parseInt)
  .parse(process.argv);

if (program.init) {
  require('./init-db').init();
}

app.get('/exif', getImageList);
app.get('/exif/:id', getExif);
app.get('/exif/:id/:attr(*)', getExif);

let port = program.port || 8080;
app.listen(port, () => {
  console.log('API server started on ' + port);
  console.log('Hit /exif to get started.');
});

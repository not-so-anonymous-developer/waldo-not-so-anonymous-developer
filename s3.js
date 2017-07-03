const AWS = require('aws-sdk');
const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
const s3 = new AWS.S3({
  params : {
     Bucket : 'waldo-recruiting'
  }
});

module.exports = s3;

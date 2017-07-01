const AWS = require('aws-sdk');
const credentials = new AWS.SharedIniFileCredentials({profile: 'no_permissions'});
AWS.config.credentials = credentials;
const s3 = new AWS.S3({
  params : {
     Bucket : 'waldo-recruiting'
  }
});

module.exports = s3;

// const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const AWS = require('aws-sdk');
const path  = require('path');
const fs  = require('fs');

// bucket name
const getFiles = async (bucketName='ainaa-manual-test-bucket') => {
  try {

    console.log('Executed'); 

    const REGION = 'ap-northeast-1';
    const s3 = new AWS.S3({ region: REGION });

    const bucketParams = {
      Bucket: bucketName, // Test Run ID 
    };

    const readStream = s3.getObject(bucketParams).createReadStream();
    const writeStream = fs.createWriteStream(path.join(__dirname, 'mochawesomeReport.json'));
    readStream.pipe(writeStream);
  } catch (err) {
    console.log('Error', err);
  }
};

getFiles();

// module.exports = { getFiles };


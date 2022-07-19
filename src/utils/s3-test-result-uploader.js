const path = require('path');
const fs = require('fs');

const Observer = require('./test-folder-watcher');
const observer = new Observer();
const config = JSON.parse(fs.readFileSync(CONIFER_CONFIG_FILE));
const folder = `${config.testDirectory}/results`;

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const putInBucket = async (pathString, uuid, bucketName = "conifer-test-output-bucket") => {
  //removed export
  try {
    const REGION = "us-west-1"; //e.g. "us-west-1"
    const s3Client = new S3Client({ region: REGION });
    const fileStream = fs.createReadStream(pathString);

    const uploadParams = {
      Bucket: bucketName,
      Key: uuid + ".json",
      Body: fileStream,
    };

    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

observer.on('file-added', log => {
  // print error message to console
  console.log(`File was added: ${log.filePath}`)

  const uuid = path.parse(log.filePath).name;

  // Export file to s3 bucket
  putInBucket(log.filePath, uuid);
});

observer.watchFolder(folder);
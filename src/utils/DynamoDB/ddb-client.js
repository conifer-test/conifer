const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CONIFER_LOCAL_DIRECTORY } = require('../coniferConfig');
const fs = require('fs');
// Set the AWS Region.
// const { awsRegion: region } = fs.readFileSync(
//   `${CONIFER_LOCAL_DIRECTORY}/conifer-config.json`
// );
// Create an Amazon DynamoDB service client object.
// const ddbClient = new DynamoDBClient({ region: region });
const ddbClient = new DynamoDBClient({ region: 'us-west-1' });

module.exports = { ddbClient };

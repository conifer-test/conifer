<<<<<<< HEAD
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { ddbClient } = require('./ddb-client.js');
const fs = require('fs');

// TODO: figure out here putItem needs to be called and remove hard-coded values
const putItem = async () => {
  try {
    // rawData should be the freshly uploaded json file that is being watched by file watcher
    const rawData = fs.readFileSync('./mochawesome.json', 'utf-8'); 
    const json = JSON.parse(rawData);

    // Assuming that test run ID is coming from a locally saved file
    const testRunID = fs.readFileSync('/Users/ainaasakinah/Code/capstone_research/conifer/test-run-id.txt', 'utf-8');
    const testFileName = './cypress/e2e/mochawesome.json'; 
    
    // The json must include the primary key and sorty key to successfully upload
    json.testFileName = testFileName; 
    json.testRunID = testRunID;

    const params = {
      TableName: 'Conifer_Test_Runs',
      Key: { testFileName: testFileName },
      Item: marshall(json)
    };

=======
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const fs = require('fs');

const REGION = 'ap-northeast-1';
const ddbClient = new DynamoDBClient({ region: REGION });

const rawData = fs.readFileSync('./mochawesome.json', 'utf-8');
const json = JSON.parse(rawData);

const testRunID = fs.readFileSync('/Users/ainaasakinah/Code/capstone_research/conifer/test-run-id.txt', 'utf-8');
const testFileName = './cypress/e2e/first-test.cy.js';

json.testFileName = testFileName; 
json.testRunID = testRunID;

// Set the parameters
const params = {
  TableName: 'Conifer_Test_Runs',
  Key: { testFileName: testFileName },
  Item: marshall(json)
};

const putItem = async () => {
  try {
>>>>>>> 72c6b3a (fix typo of folder name)
    const data = await ddbClient.send(new PutItemCommand(params));
    console.log('Item Putted', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

<<<<<<< HEAD
module.exports = { putItem };
=======
putItem();
>>>>>>> 72c6b3a (fix typo of folder name)

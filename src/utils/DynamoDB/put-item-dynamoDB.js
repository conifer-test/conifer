const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { ddbClient } = require('./ddb-client.js');
const fs = require('fs');

// TODO: figure out here putItem needs to be called and remove hard-coded values
const putNewTestFileInDynamo  = async (testFileName, testRunID) => {
  try {
    const jsonData = {
      testFileName: testFileName, // primary key
      testRunID: testRunID, // sort key
      status: 'To be executed',
    };

    const params = {
      TableName: 'Conifer_Test_Runs',
      Key: { testFileName: testFileName },
      Item: marshall(jsonData)
    };

    const data = await ddbClient.send(new PutItemCommand(params));
    console.log('New Test File Added', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

const updateExisitingTestFileInDynamo  = async (testFileName, testRunID) => {
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

    const data = await ddbClient.send(new PutItemCommand(params));
    console.log('Item Updated', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

module.exports = { putNewTestFileInDynamo, updateExisitingTestFileInDynamo };
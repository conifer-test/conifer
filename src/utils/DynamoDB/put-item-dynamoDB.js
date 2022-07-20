const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { ddbClient } = require('./ddb-client.js');
const fs = require('fs');

// const REGION = 'ap-northeast-1';
// const ddbClient = new DynamoDBClient({ region: REGION });

const rawData = fs.readFileSync('./mochawesome.json', 'utf-8');
const json = JSON.parse(rawData);

const testRunID = fs.readFileSync('/Users/ainaasakinah/Code/capstone_research/conifer/test-run-id.txt', 'utf-8');
const testFileName = './cypress/e2e/mochawesome.json';

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
    const data = await ddbClient.send(new PutItemCommand(params));
    console.log('Item Putted', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

putItem();

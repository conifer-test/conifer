const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
<<<<<<< HEAD
const { ddbDocClient } = require('./ddb-doc-client.js');

// Returns an array of JSON data for a test file passed in as argument
const getItemsByFileName = async (testFileName) => {
  try {
    // Set the query parameters
    const params = {
      KeyConditionExpression: 'testFileName = :tfn',
      ExpressionAttributeValues: {
        ':tfn': { S:testFileName }, // './cypress/e2e/first-test.cy.js'
      },
      TableName: 'Conifer_Test_Runs',
    };

    const data = await ddbDocClient.send(new QueryCommand(params));

    const results = data.Items.map(item => unmarshall(item));

    return results;
=======
const { ddbDocClient } = require('./ddbDocClient.js');

// Set the parameters
const params = {
  KeyConditionExpression: 'testFileName = :tfn and testRunID = :tr',
  ExpressionAttributeValues: {
    ':tfn': { S: './cypress/e2e/first-test.cy.js' },
    ':tr': { S: '4acbcdf2-2e89-4e66-be30-9df96c441bc6' },
  },
  TableName: 'Conifer_Test_Runs',
};

const run = async () => {
  try {
    const data = await ddbDocClient.send(new QueryCommand(params));

    const firstItem = 0;
    console.log(unmarshall(data.Items[firstItem]));

    // data.Items.forEach(function (element, index, array) {
    //   console.log(JSON.parse(element));
    // });

>>>>>>> 72c6b3a (fix typo of folder name)
  } catch (err) {
    console.error(err);
  }
};

<<<<<<< HEAD
// Returns an array of historical timing data for a test file passed in as argument
const getTimingDataByFileName = async (testFileName) => {
  try {
    // Set the parameters
    const params = {
      KeyConditionExpression: 'testFileName = :tfn',
      ExpressionAttributeValues: {
        ':tfn': { S: testFileName }, // './cypress/e2e/first-test.cy.js' 
      },
      TableName: 'Conifer_Test_Runs',
    };

    const data = await ddbDocClient.send(new QueryCommand(params));

    const results = data.Items.map(item => unmarshall(item));
    const durations = results.map(result => result.stats.duration);

    return durations;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getItemsByFileName, getTimingDataByFileName };
=======
run();
>>>>>>> 72c6b3a (fix typo of folder name)

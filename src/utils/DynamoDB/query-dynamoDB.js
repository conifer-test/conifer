const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
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
  } catch (err) {
    console.error(err);
  }
};

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
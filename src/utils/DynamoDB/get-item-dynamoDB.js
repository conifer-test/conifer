const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { ddbDocClient } = require('./ddb-doc-client.js');

// getItems returns a single Item from dynamoDB, must provide both file name and test run ID
const getItemByFileNameAndTestRunID = async (fileName, testRunID) => {
  try {
    // Set the query parameters
    const params = {
      TableName: 'Conifer_Test_Runs',
      Key: {
        testFileName: fileName , // e.g './cypress/e2e/first-test.cy.js'
        testRunID: testRunID, // e.g '4acbcdf2-2e89-4e66-be30-9df96c441bc6'
      },
    };

    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item;
  } catch (err) {
    console.log('Error', err);
  }
};

module.exports = { getItemByFileNameAndTestRunID };
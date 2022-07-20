const { GetCommand } = require('@aws-sdk/lib-dynamodb');
<<<<<<< HEAD
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
=======
const { ddbDocClient } = require('./ddbDocClient.js');

// Set the parameters.
const params = {
  TableName: 'Conifer_Test_Runs',
  Key: {
    testFileName: './cypress/e2e/first-test.cy.js' ,
    testRunID: '4acbcdf2-2e89-4e66-be30-9df96c441bc6',
  },
};

const getItem = async () => {
  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    console.log('Success :', data.Item);
>>>>>>> 72c6b3a (fix typo of folder name)
  } catch (err) {
    console.log('Error', err);
  }
};

<<<<<<< HEAD
module.exports = { getItemByFileNameAndTestRunID };
=======
getItem();
>>>>>>> 72c6b3a (fix typo of folder name)

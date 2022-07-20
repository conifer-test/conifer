const { GetCommand } = require('@aws-sdk/lib-dynamodb');
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
  } catch (err) {
    console.log('Error', err);
  }
};

getItem();
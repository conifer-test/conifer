const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { ddbDocClient } = require('./ddb-doc-client.js');

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

  } catch (err) {
    console.error(err);
  }
};

run();
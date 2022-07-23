const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { ddbDocClient } = require('./ddb-doc-client.js');


const getItemsByTestFileName = async (testFileName) => {
  try {
    const params = {
      TableName: 'Conifer_Test_Runs3',
      IndexName: 'testFile',
      KeyConditionExpression: 'testFileName = :tri',
      ExpressionAttributeValues: {
        ':tri': { 'S': testFileName }
      }
    };

    const data = await ddbDocClient.send(new QueryCommand(params));

    const results = data.Items.map(item => unmarshall(item));

    return results;
  } catch (err) {
    console.error('error in getItemsByTestFileName: ', err);
  }
};

const a = async () => {
  const b = await getItemsByTestFileName('./cypress/e2e/second-test.cy.js');
  // console.log(b);
};

// a();

module.exports = getItemsByTestFileName;
const { QueryCommand, DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const REGION = 'ap-northeast-1';
const ddbClient = new DynamoDBClient({ region: REGION });

// Set the parameters
const params = {
  KeyConditionExpression: 'testFileName = :s and testRunID = :e',
  // FilterExpression: 'contains (testFileNam, :s)',
  ExpressionAttributeValues: {
    ':s': { S: './cypress/e2e/first-test.cy.js' },
    ':e': { S: '4acbcdf2-2e89-4e66-be30-9df96c441bc6' },
    // ":topic": { S: "SubTitle" }
  },
  ProjectionExpression: 'TestFileName, TestRunID',
  TableName: 'Conifer_Test_Runs',
};

const run = async () => {
  try {
    console.log('line 22');
    let data = await ddbClient.send(new QueryCommand(params));
    // return data;
    data = unmarshall(data.Items);
    console.log(data);
    data.Items.forEach(function (element, index, array) {
      console.log(element);
    });
  } catch (err) {
    console.error(err);
  }
};

console.log('line 32');
run();
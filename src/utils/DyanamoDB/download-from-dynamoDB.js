const { QueryCommand, DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const oldAWS = require('aws-sdk');

const REGION = 'ap-northeast-1';
const ddbClient = new DynamoDBClient({ region: REGION });

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
    console.log('line 22');
    let data = await ddbClient.send(new QueryCommand(params));
    // return data;
    // let unmarshallData = unmarshall(data.Items);
    // console.log(JSON.parse(data));
    console.log('original data', data.Items);

    const unmarshallData = unmarshall(JSON.stringify(data.Items));

    // let s = JSON.stringify(data.Items);
    // s =  s.replace('"B":', '"S":');
    // const parsed_json = JSON.parse(s);
    // const unmarshallData = oldAWS.DynamoDB.Converter.unmarshall(parsed_json);

    console.log('unmarshal data', unmarshallData);

    // data.Items.forEach(function (element, index, array) {
    //   console.log(JSON.parse(element));
    // });

  } catch (err) {
    console.error(err);
  }
};

console.log('line 32');
run();
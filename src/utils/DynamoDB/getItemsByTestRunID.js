const { QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const { ddbDocClient } = require('./ddb-doc-client');
const { CONIFER_LOCAL_DIRECTORY } = require('../coniferConfig');
const fs = require('fs');

const {
  ConiferCdkStack: { tableName },
} = JSON.parse(fs.readFileSync(`${CONIFER_LOCAL_DIRECTORY}/cdk_outputs.json`));

const getItemsByTestRunID = async (testRunID) => {
  try {
    const params = {
      TableName: tableName,
      IndexName: 'testRun',
      KeyConditionExpression: 'testRunID = :tri',
      ExpressionAttributeValues: {
        ':tri': { S: testRunID },
      },
    };

    const data = await ddbDocClient.send(new QueryCommand(params));
    const results = data.Items.map((item) => unmarshall(item));

    return results;
  } catch (err) {
    console.error('Error in getItemsByTestRunID: ', err);
  }
};

module.exports = getItemsByTestRunID;

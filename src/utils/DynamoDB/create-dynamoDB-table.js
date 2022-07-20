const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./ddb-client.js');

const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'testFileName', //ATTRIBUTE_NAME_1
      AttributeType: 'S', //ATTRIBUTE_TYPE
    },
    {
      AttributeName: 'testRunID',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'testFileName', //ATTRIBUTE_NAME_1
      KeyType: 'HASH',
    },
    {
      AttributeName: 'testRunID',
      KeyType: 'RANGE',
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: 'Conifer_Test_Runs', //TABLE_NAME
  StreamSpecification: {
    StreamEnabled: false,
  },
};

// Creates a table using the above params if it doesn' exist yet
const makeTable = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(tableParams));
    // console.log('Conifer table created', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

module.exports = { makeTable };
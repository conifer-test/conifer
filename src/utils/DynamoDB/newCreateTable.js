const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { ddbClient } = require('./ddb-client.js');

const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'testFileName', 
      AttributeType: 'S', 
    },
    {
      AttributeName: 'testRunID',
      AttributeType: 'S'
    }
  ],
  GlobalSecondaryIndexes: [
    {
      'IndexName': 'testRun',
      'Projection': {
        'ProjectionType': 'ALL'
      },
      'ProvisionedThroughput': {
        'NumberOfDecreasesToday': 0,
        'WriteCapacityUnits': 5,
        'ReadCapacityUnits': 10
      },
      'KeySchema': [
        {
          'KeyType': 'HASH',
          'AttributeName': 'testRunID'
        }
      ]
    },
    {
      'IndexName': 'testFile',
      'Projection': {
        'ProjectionType': 'ALL'
      },
      'ProvisionedThroughput': {
        'NumberOfDecreasesToday': 0,
        'WriteCapacityUnits': 5,
        'ReadCapacityUnits': 10
      },
      'KeySchema': [
        {
          'KeyType': 'HASH',
          'AttributeName': 'testFileName'
        }
      ]
    }
  ],
  KeySchema: [
    {
      AttributeName: 'testFileName', 
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
  TableName: 'Conifer_Test_Runs3', 
  StreamSpecification: {
    StreamEnabled: false,
  },
};


const makeTable = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(tableParams));
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

makeTable();

module.exports = makeTable;
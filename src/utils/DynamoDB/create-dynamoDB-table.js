const { CreateTableCommand, DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const REGION = 'ap-northeast-1';
const ddbClient = new DynamoDBClient({ region: REGION });

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

const makeTable = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(tableParams));
    console.log('Conifer table created', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

makeTable();
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { ddbClient } = require('./ddb-client.js');
const fs = require('fs');

const putItem = async (fileName) => {
  try {

    const rawData = fs.readFileSync('./objs/' + fileName + '.json', 'utf-8');
    const json = JSON.parse(rawData);

    const testFileName = json.testFileName;

    const params = {
      TableName: 'Conifer_Test_Runs3',
      Key: { testFileName: testFileName },
      Item: marshall(json)
    };

    const data = await ddbClient.send(new PutItemCommand(params));
    console.log('Item Putted', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

['obj1','obj2','obj3','obj4','obj5','obj6','obj7','obj8'].forEach(elem => {
  putItem(elem);
});

// putItem('obj1');


module.exports =  putItem;
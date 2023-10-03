const { marshall } = require('@aws-sdk/util-dynamodb');
const DynamoDB = require('@aws-sdk/client-dynamodb');
const database = require('../index');

module.exports = (TableName) => ({
  getByKey: async (Key) => {
    const command = new DynamoDB.GetItemCommand({ TableName, Key });
    return database.send(command);
  },
  create: async (data) => {
    const command = new DynamoDB.PutItemCommand({ Item: marshall(data), TableName });
    return database.send(command);
  },
  updateByKey: async (Key, data) => {
    const dataKeys = Object.dataKeys(data);
    const command = new DynamoDB.UpdateItemCommand({
      TableName,
      Key,
      UpdateExpression: `SET ${dataKeys.map((item) => `#k_${item} = :v_${item}`)}`,
      ExpressionAttributeNames: Object.assign(...dataKeys.map((item) => ({ [`#k_${item}`]: item }))),
      ExpressionAttributeValues: Object.assign(...dataKeys.map((item) => ({ [`v_${item}`]: data[item] }))),
      ReturnValues: 'ALL_NEW',
    });
    return database.send(command);
  },
  deleteByKey: async (Key) => {
    const command = new DynamoDB.DeleteItemCommand({ TableName, Key });
    return database.send(command);
  },
  list: async () => {
    const command = new DynamoDB.ScanCommand({ TableName, Select: 'ALL_ATTRIBUTES' });
    return database.send(command);
  },
});

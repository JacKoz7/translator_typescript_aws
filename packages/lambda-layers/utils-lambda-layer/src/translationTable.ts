import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ITranslateDbObject } from "@sff/shared-types";

export class TranslationTable {
  tableName: string;
  partitionKey: string;
  dynamodbClient: dynamodb.DynamoDBClient;
  constructor({
    tableName,
    partitionKey,
  }: {
    tableName: string;
    partitionKey: string;
  }) {
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.dynamodbClient = new dynamodb.DynamoDBClient({});
  }

  async insert(data: ITranslateDbObject) {
    const tableInsertCmd: dynamodb.PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall(data), // marshal converts tableObj to format suitable for our db
    };

    await this.dynamodbClient.send(new dynamodb.PutItemCommand(tableInsertCmd));
  }

  async getAll() {
    const ScanCmd: dynamodb.ScanCommandInput = {
      TableName: this.tableName,
    };

    const { Items } = await this.dynamodbClient.send(
      new dynamodb.ScanCommand(ScanCmd)
    );

    if (!Items) {
        return [];
      }

    const rtnData = Items.map((item) => unmarshall(item) as ITranslateDbObject);
    return rtnData;
  }
}

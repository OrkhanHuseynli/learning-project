import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const config: DynamoDBClientConfig = {
  region: process.env["AWS_REGION"] || "us-east-1",
  credentials: {
    accessKeyId: process.env["AWS_ACCESS_KEY"] || "fake",
    secretAccessKey: process.env["AWS_SECRET_KEY"] || "fake",
  },
};

if (!process.env["AWS_ACCESS_KEY"] && !process.env["AWS_SECRET_KEY"]) {
  let e = process.env["DYNAMODB_URL"];
  console.log(`DYNAMODB URL : ${e}`);
  if (e === null) {
    e = "http://localhost:8000";
  }
  config.endpoint = e;
}

const dynamodb = new DynamoDBClient(config);

export default dynamodb;



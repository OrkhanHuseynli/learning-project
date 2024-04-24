import CreateTables from "../migrations/create_table";

(async () => {
  try {
    const tableResult = await CreateTables();
    console.log(tableResult);
    console.log("Post tables is was created in DynamoDB ");
  } catch (err) {
    console.log("error setting up dynamodb while creating the Post table", err);
    process.exit();
  }
})();

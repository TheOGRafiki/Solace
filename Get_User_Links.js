exports = async function (request, response) {
  // Access the username from the arg object
  const username = request.query["username"];

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "Cluster0";

  // Update these to reflect your db/collection
  var dbName = "Solace";
  var collName = "UserLinks";

  // Get a collection from the context
  var collection = context.services
    .get(serviceName)
    .db(dbName)
    .collection(collName);

  var findResult;
  try {
    // Execute a FindOne in MongoDB
    findResult = await collection.findOne({ "user.username": username });
    delete findResult["_id"];
    delete findResult["auth0_user_id"];
  } catch (err) {
    console.log("Error occurred while executing findOne:", err.message);
    return { error: err.message };
  }

  return findResult["user"];
};

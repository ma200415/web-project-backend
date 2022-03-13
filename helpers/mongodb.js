const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoAuth = require('../config')

const mongo_username = mongoAuth.configMongo.user
const mongo_password = mongoAuth.configMongo.pwd
const mongo_host = mongoAuth.configMongo.host
const DATABASE_NAME = mongoAuth.configMongo.dbname

const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@${mongo_host}/${DATABASE_NAME}?retryWrites=true&w=majority`

exports.run_query = async function run_query(collection, query) {
  const client = new MongoClient(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  const dbClient = await client.connect();

  const result = await dbClient.db(DATABASE_NAME).collection(collection).find(query).toArray();

  client.close();

  return result;
}
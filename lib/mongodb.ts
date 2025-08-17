import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/test";
let client: MongoClient;
// eslint-disable-next-line prefer-const
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
// eslint-disable-next-line prefer-const
clientPromise = global._mongoClientPromise!;

export default clientPromise;

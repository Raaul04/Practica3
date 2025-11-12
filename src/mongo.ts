import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;
const dbName = "Base";

export const connectMongo = async (): Promise<void> => {
  try {
    const urlMongo = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.fvbhm4j.mongodb.net/?appName=${process.env.CLUSTERNAME}`;
    client = new MongoClient(urlMongo);
    await client.connect();
    db = client.db(dbName);
    console.log("Conectado al Mongo");
  } catch (error) {
    console.log("Error mongo: ", error);
  }
};

export const getDB = (): Db => db;

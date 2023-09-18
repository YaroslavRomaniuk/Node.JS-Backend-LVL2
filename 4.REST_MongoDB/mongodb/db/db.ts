import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri: string | undefined  = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MongoDB URI is not defined in the environment variables');
}

let dbConnection: Db;

export const connectToDb = (cb: (error?: Error) => void) => {
  MongoClient.connect(uri)
    .then((client: MongoClient) => {
      console.log('Connected to MongoDB');
      dbConnection = client.db('todos_app');
      return cb();
    })
    .catch((err: Error) => {
      return cb(err);
    });
};

export const getDB = (): Db => {
  if (!dbConnection) {
    throw new Error('Database connection not established');
  }
  return dbConnection;
};
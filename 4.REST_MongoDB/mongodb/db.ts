import { MongoClient, Db } from 'mongodb';

const uri: string = 'mongodb+srv://romaniuk007:LTwOGMGF0vGgYblY@myfirstcluster.qqcvgpb.mongodb.net/';

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
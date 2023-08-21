import { MongoClient, Db } from 'mongodb';

const uri: string = 'mongodb+srv://romaniuk007:LTwOGMGF0vGgYblY@myfirstcluster.qqcvgpb.mongodb.net/';

let dbConnection: Db;

module.exports = {
  connectToDb: (cb: (error?: Error) => void) => {
    MongoClient.connect(uri)
      .then((client: MongoClient) => {
        console.log('Connected to MongoDB');
        dbConnection = client.db();
        return cb();
      })
      .catch((err: Error) => {
        return cb(err);
      });
  },

  getDB: () => dbConnection,
};
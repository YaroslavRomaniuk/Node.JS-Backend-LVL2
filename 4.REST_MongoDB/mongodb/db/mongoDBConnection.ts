import session from 'express-session';
import { Express } from 'express';
import { connectToDb, getDB } from './db';
const MongoDBStore = require('connect-mongodb-session')(session);

export default function mongoDBConnection(server: Express) {
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: process.env.MONGODB_COLLECTION
  });

  if(!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not defined');
  } 
  
  server.use(session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      store: store,
      resave: false,
      saveUninitialized: false
  }));

  const port = process.env.PORT;
  connectToDb((err?: Error) => {
    if (!err) {
      server.listen(port, () => {
        console.log("Listening on port:", port);
      }).on("error", (err: Error) => {
        console.log("ERROR:", err);
      });

      getDB();
    } else {
      console.log(`DB connection error: ${err}`);
    }
  });
}
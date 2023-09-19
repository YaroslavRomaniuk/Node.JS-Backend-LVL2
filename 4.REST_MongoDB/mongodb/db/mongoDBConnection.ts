import session from 'express-session';
import { Express } from 'express';
import { connectToDb, getDB } from './db';

// Importing MongoDB session store
const MongoDBStore = require('connect-mongodb-session')(session);

// Function to establish MongoDB connection and configure Express server
export default function mongoDBConnection(server: Express) {
  // Creating a new MongoDB session store
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: process.env.MONGODB_COLLECTION
  });

  // Throwing an error if session secret is not defined in environment variables
  if(!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not defined');
  } 
  
  // Using express session middleware with the created store and secret
  server.use(session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },  // Setting cookie max age to 24 hours
      store: store,
      resave: false,
      saveUninitialized: false
  }));

  // Extracting port from environment variables
  const port = process.env.PORT;

  // Connecting to the database and starting the server
  connectToDb((err?: Error) => {
    if (!err) {
      server.listen(port, () => {
        // Logging the successful server start
        console.log("Listening on port:", port);
      }).on("error", (err: Error) => {
        // Logging any server start error
        console.log("ERROR:", err);
      });

      // Getting the database connection
      getDB();
    } else {
      // Logging any database connection error
      console.log(`DB connection error: ${err}`);
    }
  });
}
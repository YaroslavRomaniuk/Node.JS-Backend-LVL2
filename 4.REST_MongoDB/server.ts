import express from 'express';
//import session from 'express-session';
//import fileStore, { FileStore } from 'session-file-store'

const {connectToDb, getDB} = require('./db');
import { Db, Collection, ObjectId } from 'mongodb';

let db: Db;



connectToDb((err?: Error) => {
  if (!err) {
    server.listen(port, () => {
      console.log("Listening on port:", port);
    }).on("error", (err: Error) => {
      console.log("ERROR:", err);
    });

    db = getDB(); // Assign value to the top-level db variable
  } else {
    console.log(`DB connection error: ${err}`);
  }
});


//const FileStore: FileStore = fileStore(session)
const cors = require('cors');


const port = 3005;
const server = express();
let testID = 0;

/** 
server.use(session({
  store: new FileStore({retries: 10}),
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
*/

server.use(express.json());
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));

const router = require('./routes/routes')
server.use('/api/v1/', router)
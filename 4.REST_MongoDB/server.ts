import express from 'express';
import session from 'express-session';
import cors from 'cors';

const {connectToDb, getDB} = require('./mongodb/db');
import { connectMySQLdb, createDatabaseAndTables, createTables } from './mysql/mysql_db';
import { Db} from 'mongodb';
const MongoDBStore = require('connect-mongodb-session')(session);

let mongoDB = false;

let db: Db;

const port = 3005;
const server = express();
server.use(express.static('static'));
server.use(express.json());

/** 
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));
*/

if(mongoDB){

  const store = new MongoDBStore({
    uri: 'mongodb+srv://romaniuk007:LTwOGMGF0vGgYblY@myfirstcluster.qqcvgpb.mongodb.net/todos_app',
    collection: 'sessions'
  });
  
  server.use(session({
    secret: 'your_secret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    store: store,
    resave: false,
    saveUninitialized: false
  }));
  
  connectToDb((err?: Error) => {
    if (!err) {
      server.listen(port, () => {
        console.log("Listening on port:", port);
      }).on("error", (err: Error) => {
        console.log("ERROR:", err);
      });
  
      db = getDB();
    } else {
      console.log(`DB connection error: ${err}`);
    }
  });
} else {
  connectMySQLdb();
  //createDatabaseAndTables();
  createTables();
}




const router_v1 = require('./routes/routes_v1')
const router_v2 = require('./routes/routes_v2')
server.use('/api/v1/', router_v1)
server.use('/api/v2/', router_v2)
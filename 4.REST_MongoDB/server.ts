
import express from 'express';
import session from 'express-session';
import cors from 'cors';


const { connectToDb, getDB } = require('./mongodb/db/db');
const { getDBMySQL } = require('./mysql/db/db');
import { connectMySQLdb } from './mysql/db/db';
import { Db } from 'mongodb';
import { Connection } from 'mysql2/promise';
const MongoDBStore = require('connect-mongodb-session')(session);
const MySQLStore = require('express-mysql-session')(session);

let mongoDB = false;

let db: Db;
let mysql_db: Promise<Connection | undefined>;

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

if (mongoDB) {

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
  

  connectMySQLdb((err?: Error) => {
    if (!err) {
      server.listen(port, () => {
        console.log("Listening on port:", port);
      }).on("error", (err: Error) => {
        console.log("ERROR:", err);
      });

      mysql_db = getDBMySQL();
    } else {
      console.log(`DB connection error: ${err}`);
    }
  });


  const sessionStore = new MySQLStore({
    host: 'myfirstawsdb.coo1p4sufx7v.eu-north-1.rds.amazonaws.com',
    user: 'YAR',
    password: '12345678yar!!!',
    database: 'todo_db',
    clearExpired: true,
    checkExpirationInterval: 900000, 
  });

  server.use(session({
    secret: 'your_secret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }));

}



let router_v1;
let router_v2;
if (mongoDB) {
  router_v1 = require('./mongodb/routes/routes_v1')
  router_v2 = require('./mongodb/routes/routes_v2')
} else {
  router_v1 = require('./mysql/routes/routes_v1')
  router_v2 = require('./mysql/routes/routes_v2')
}

server.use('/api/v1/', router_v1)
server.use('/api/v2/', router_v2)
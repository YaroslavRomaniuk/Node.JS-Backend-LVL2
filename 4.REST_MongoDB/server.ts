
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { connectToDb, getDB } from './mongodb/db/db';
import { connectMySQLdb, getDBMySQL } from './mysql/db/db';
import { Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MongoDBStore = require('connect-mongodb-session')(session);
const MySQLStore = require('express-mysql-session')(session);

let mongoDB = process.env.DB_TYPE; 



const port = 3005;
const server = express();
server.use(express.static('static'));
server.use(express.json());


server.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
}));

const isMongoDB = process.env.DB_TYPE === 'mongodb';

if (isMongoDB) {

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
} else {
  

  connectMySQLdb((err?: Error) => {
    if (!err) {
      server.listen(port, () => {
        console.log("Listening on port:", port);
      }).on("error", (err: Error) => {
        console.log("ERROR:", err);
      });

      const db = getDBMySQL();
    } else {
      console.log(`DB connection error: ${err}`);
    }
  }); 


  const sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    clearExpired: true,
    checkExpirationInterval: 900000, 
  });

  if(!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not defined');
  }
  
  server.use(session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      store: sessionStore,
      resave: false,
      saveUninitialized: false
  }));
}



let router_v1;
let router_v2;
if (isMongoDB) {
  router_v1 = require('./mongodb/routes/routes_v1')
  router_v2 = require('./mongodb/routes/routes_v2')
} else {
  router_v1 = require('./mysql/routes/routes_v1')
  router_v2 = require('./mysql/routes/routes_v2')
}

server.use('/api/v1/', router_v1)
server.use('/api/v2/', router_v2)
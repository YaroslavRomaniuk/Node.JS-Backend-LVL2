
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoDBConnection from './mongodb/db/mongoDBConnection';
import mySQLConnection from './mysql/db/mySQLConnection';
import dotenv from 'dotenv';

dotenv.config();

const MongoDBStore = require('connect-mongodb-session')(session);
const MySQLStore = require('express-mysql-session')(session);


const port = process.env.PORT;
const server = express();
server.use(express.static('static'));
server.use(express.json());


server.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
}));

const dbType = process.env.DB_TYPE;

let router_v1;
let router_v2;

if (dbType === 'mongodb') {

  mongoDBConnection(server);

  router_v1 = require('./mongodb/routes/routes_v1')
  router_v2 = require('./mongodb/routes/routes_v2')

} else if (dbType === 'mysql') {
  
  mySQLConnection(server);
  router_v1 = require('./mysql/routes/routes_v1')
  router_v2 = require('./mysql/routes/routes_v2')
} else {
  console.log("Please, choose between mongodb and mysql db in .env file")
}

server.use('/api/v1/', router_v1)
server.use('/api/v2/', router_v2) 


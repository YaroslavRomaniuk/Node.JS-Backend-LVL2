
import express from 'express';
import cors from 'cors';
import mongoDBConnection from './mongodb/db/mongoDBConnection';
import mySQLConnection from './mysql/db/mySQLConnection';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
server.use(express.static('static'));
server.use(express.json());

// Enable Cross-Origin Resource Sharing with specific options
server.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
}));

const dbType = process.env.DB_TYPE;

let router_v1;
let router_v2;

if (dbType === 'mongodb') {

  // Establish MongoDB connection
  mongoDBConnection(server);

  // Import route handlers for API version 1 and version 2 for MongoDB
  router_v1 = require('./mongodb/routes/routes_v1')
  router_v2 = require('./mongodb/routes/routes_v2')

} else if (dbType === 'mysql') {

  // Establish MySQL connection
  mySQLConnection(server);

  // Import route handlers for API version 1 and version 2 for MySQL
  router_v1 = require('./mysql/routes/routes_v1')
  router_v2 = require('./mysql/routes/routes_v2')
} else {
  console.log("Please, choose between mongodb and mysql db in .env file")
}

// Set up API routes for version 1 and version 2
server.use('/api/v1/', router_v1)
server.use('/api/v2/', router_v2)


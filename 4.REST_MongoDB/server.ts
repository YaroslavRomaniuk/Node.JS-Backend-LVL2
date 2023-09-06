
import express from 'express';
import session from 'express-session';
import cors from 'cors';


const { connectToDb, getDB } = require('./mongodb/db/db');
const { getDBMySQL } = require('./mysql/db/db');
import { connectMySQLdb, createDatabaseAndTables, createTables } from './mysql/db/db';
import { Db } from 'mongodb';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
import { Connection } from 'mysql2/promise';
const MongoDBStore = require('connect-mongodb-session')(session);

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
  //createDatabaseAndTables();
  //createTables();
}

server.post('/mysql/users', async (req, res) => {
  try {
    const { login, pass } = req.body;
    const connection = await mysql_db;

    if (!connection) {
      return res.status(500).json({ error: 'MySQL connection error' });
    }

    const [result] = await connection.query(
      'INSERT INTO users (login, pass) VALUES (?, ?)',
      [login, pass]
    );
    console.log('User created successfully')
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

server.get('/mysql/getusers', async (req, res) => {
  try {
    const connection = await mysql_db;

    if (!connection) {
      return res.status(500).json({ error: 'MySQL connection error' });
    }

    const [results] = await connection.query('SELECT * FROM users');
    const users = results;

    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
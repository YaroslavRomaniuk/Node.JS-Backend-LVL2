import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let dbConnection: mysql.Connection;

export const connectMySQLdb = (cb: (error?: Error) => void) => {
  mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
    .then((connection: mysql.Connection) => {
      console.log("!!! MySQL DB CONNECTED !!!")
      dbConnection = connection;
      return cb();
    })
    .catch((err: Error) => {
      return cb(err);
    });
}

export const getDBMySQL = (): mysql.Connection => {
  if (!dbConnection) {
    throw new Error('Database connection not established');
  }
  return dbConnection;
};

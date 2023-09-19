import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Variable to hold the connection to the MySQL database
let dbConnection: mysql.Connection;

// Function to connect to the MySQL database
export const connectMySQLdb = (cb: (error?: Error) => void) => {
  // Create a new connection using the environment variables
  mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
    .then((connection: mysql.Connection) => {
      // Log success message and save the connection to the dbConnection variable
      console.log("!!! MySQL DB CONNECTED !!!")
      dbConnection = connection;
      // Call the callback function without any arguments (indicating success)
      return cb();
    })
    .catch((err: Error) => {
      // If an error occurred, call the callback function with the error
      return cb(err);
    });
}

// Function to get the MySQL database connection
export const getDBMySQL = (): mysql.Connection => {
  // If the connection has not been established, throw an error
  if (!dbConnection) {
    throw new Error('Database connection not established');
  }
  // Otherwise, return the connection
  return dbConnection;
};

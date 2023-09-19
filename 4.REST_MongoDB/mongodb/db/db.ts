import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Loading environment variables
dotenv.config();

// Getting MongoDB URI from environment variables
const uri: string | undefined  = process.env.MONGODB_URI;

// Throwing an error if MongoDB URI is not defined in environment variables
if (!uri) {
  throw new Error('MongoDB URI is not defined in the environment variables');
}

// Variable to store the database connection
let dbConnection: Db;

// Function to connect to the MongoDB database
export const connectToDb = (cb: (error?: Error) => void) => {
  MongoClient.connect(uri)
    .then((client: MongoClient) => {
      
      // Logging the successful connection
      console.log('Connected to MongoDB');

      // Setting the database connection
      dbConnection = client.db('todos_app');

      // Calling the callback function without any error
      return cb();
    })
    .catch((err: Error) => {
      // Calling the callback function with the caught error
      return cb(err);
    });
};

// Function to get the database connection
export const getDB = (): Db => {
  // Throwing an error if the database connection is not established
  if (!dbConnection) {
    throw new Error('Database connection not established');
  }

  // Returning the database connection
  return dbConnection;
};
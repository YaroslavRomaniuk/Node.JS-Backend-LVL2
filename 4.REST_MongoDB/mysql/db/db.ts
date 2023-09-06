import mysql from 'mysql2/promise';

let dbConnection: mysql.Connection;

export const connectMySQLdb = (cb: (error?: Error) => void) => {
    mysql.createConnection({
      host: 'myfirstawsdb.coo1p4sufx7v.eu-north-1.rds.amazonaws.com',
      user: 'YAR',
      password: '12345678yar!!!',
      database: 'todo_db'
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

export async function createDatabaseAndTables() {
    const connection = await getDBMySQL();

    const databaseName = 'todo_db';

    // Create a new database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    console.log("!!! DATABASE CREATED !!!")

    // Use the new database
    await connection.query(`USE ${databaseName}`);
    console.log("!!! USING DATABASE !!!")

    // Now you can create your tables here...

    await connection.end();
}

export async function createTables() {
    const connection = await getDBMySQL();

    // Create 'users' table
    const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255) NOT NULL,
            pass VARCHAR(255) NOT NULL
        )
    `;
    await connection.query(usersTable);
    console.log("!!! USERS TABLE CREATED !!!")

    // Create 'items' table
    const itemsTable = `
        CREATE TABLE IF NOT EXISTS items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            text VARCHAR(255) NOT NULL,
            checked BOOLEAN DEFAULT false,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;
    await connection.query(itemsTable);
    console.log("!!! ITEMS TABLE CREATED !!!")

    await connection.end();
}

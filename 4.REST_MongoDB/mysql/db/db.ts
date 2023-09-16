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

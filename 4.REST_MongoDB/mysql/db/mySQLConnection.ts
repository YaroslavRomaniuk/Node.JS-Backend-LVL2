import session from 'express-session';
import { Express } from 'express';
import { connectMySQLdb, getDBMySQL } from './db';
const MySQLStore = require('express-mysql-session')(session);

// Function to setup MySQL connection and session store
export default function mySQLConnection(server: Express) {
    const port = process.env.PORT;

    // Connect to MySQL database
    connectMySQLdb((err?: Error) => {
        if (!err) {
            // If connection is successful, start the server
            server.listen(port, () => {
                console.log("Listening on port:", port);
            }).on("error", (err: Error) => {
                // Log any error that occurs when starting the server
                console.log("ERROR:", err);
            });

            // Get the database connection
            const db = getDBMySQL();
        } else {
            // If there is an error when connecting to the database, log the error
            console.log(`DB connection error: ${err}`);
        }
    });

    // Create a new session store using MySQL
    const sessionStore = new MySQLStore({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        clearExpired: true,
        checkExpirationInterval: 900000,
    });

    // Throw an error if SESSION_SECRET is not defined in the environment variables
    if (!process.env.SESSION_SECRET) {
        throw new Error('SESSION_SECRET is not defined');
    }

    // Use express-session middleware with the MySQL session store
    server.use(session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));
}
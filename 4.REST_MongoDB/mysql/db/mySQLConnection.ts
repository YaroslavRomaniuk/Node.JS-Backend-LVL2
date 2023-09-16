import session from 'express-session';
import { Express } from 'express';
import { connectMySQLdb, getDBMySQL } from './db';
const MySQLStore = require('express-mysql-session')(session);

export default function mySQLConnection(server: Express) {
    const port = process.env.PORT;
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

    if (!process.env.SESSION_SECRET) {
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
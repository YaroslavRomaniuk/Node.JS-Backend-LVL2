import express from 'express';
import session from 'express-session';
const cors = require('cors');
const {connectToDb, getDB} = require('./db');
import { Db, Collection, ObjectId } from 'mongodb';
import SessionData from './custom.d'
const MongoDBStore = require('connect-mongodb-session')(session);

let db: Db;

const port = 3005;
const server = express();

const sessionStore = new session.MemoryStore();
server.use(express.static('static'));

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

server.use(express.json());
/** 
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));
*/

connectToDb((err?: Error) => {
  if (!err) {
    server.listen(port, () => {
      console.log("Listening on port:", port);
    }).on("error", (err: Error) => {
      console.log("ERROR:", err);
    });

    db = getDB(); // Assign value to the top-level db variable
  } else {
    console.log(`DB connection error: ${err}`);
  }
});



server.get('/get-session/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  sessionStore.get(sessionId, (err, session) => {
      if(err) {
          // handle error
          console.log(err);
          res.status(500).send('Error retrieving session');
      } else {
          console.log(req.session.login)
          res.send(session);
      }
  });
});




const router = require('./routes/routes')
server.use('/api/v1/', router)
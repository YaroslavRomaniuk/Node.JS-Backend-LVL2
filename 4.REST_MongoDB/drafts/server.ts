import express from 'express';
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//const cookieParser = require('cookie-parser');

const {connectToDb, getDB} = require('./db');
import { Db, Collection, ObjectId } from 'mongodb';

let db: Db;



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



const cors = require('cors');


const port = 3005;
const server = express();
let testID = 0;

server.use(session({
    store: new FileStore({ retries: 0 }),
    secret: 'puuuupaaaa',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000, //2 hours
    }
}));

server.use(express.json());
//server.use(cookieParser());
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));

const authRouter = require('./auth/authRoutes')
server.use('/api/v1/', authRouter)

  
//const routes = require('./routes')
    //server.use('/api/v1/', routes)



 



interface Item {
  text:string;
  checked:boolean;
}


const items: { id: number; text: string; checked: boolean }[] = [];


//server.use(express.static('public'));

server.get("/api/v1/items", (req, res) => {
  db.collection('todos')
    .find()
    .toArray()
    .then((todos) => {
  
      res.status(200).json({ items: todos });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});


server.post('/api/v1/items', (req, res) => {
  const newItem: Item = {
  
    text: req.body.text,
    checked: false,
  };

  db.collection('todos')
    .insertOne(newItem)
    .then(result => {
      res.status(201).json({ id: result.insertedId });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});


server.put('/api/v1/items/', (req, res) => {
  const itemId = req.body.id;

  
  const updatedItem: Item = {
    text: req.body.text,
    checked: req.body.checked
  };
  console.log(updatedItem)
  
  db.collection('todos')
    .updateOne(
      { _id: new ObjectId(itemId) },
      { $set: updatedItem}
    )
    .then(() => {
      res.status(200).json({ "ok" : true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});


server.delete('/api/v1/items/', (req, res) => {
  console.log("DEEEEEEEELLLLLLLLLEEEEEEEEEEETTTTTTTTEEEEEEE")
  const itemId = req.body.id;
  console.log(itemId)
  db.collection('todos')
    .deleteOne({ _id: new ObjectId(itemId) })
    .then(() => {
      res.status(200).json({ "ok" : true });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});
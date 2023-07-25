import express from 'express';
import fs from 'fs';

const bodyParser = require('body-parser');

const port = 3005;
const server = express();

interface Item {
  id:number;
  text:string;
  checked:boolean;
}


const items: { id: number; text: string; checked: boolean }[] = [];



server.use(bodyParser.json())

server.listen(port, () => {
  console.log("Listening on port:", port);
}).on("error", (err: Error) => {
  console.log("ERROR:", err);
});

server.post("/api/v1/items", (req, res) =>{

  let newID = parseInt(readLastId()) + 1;

  saveNewId(newID);
  
  let newItem: Item = {
    id:newID,
    text: req.body,
    checked: true
  };

  items.push(newItem);
  res.json({ id: newItem.id });

  console.log(newItem);
});

server.get("/api/v1/itemsTEST", (req, res) =>{
  console.log(items);
})

server.get("/api/v1/items", (req, res) =>{
  res.json(items);
})


function readLastId(): string {
  try {
    return fs.readFileSync('lastId.txt', 'utf-8');
  } catch (error) {
    return '';
  }
}

function saveNewId(id: number): void {
  fs.writeFileSync('lastId.txt', id.toString());
}
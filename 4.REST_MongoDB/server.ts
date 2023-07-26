import express from 'express';
import fs from 'fs';

const cors = require('cors');
const bodyParser = require('body-parser');


const port = 3005;
const server = express();

server.use(bodyParser.json());
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true,
}));


interface Item {
  id:number;
  text:string;
  checked:boolean;
}


const items: { id: number; text: string; checked: boolean }[] = [];





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

server.put("/api/v1/items", (req, res) =>{
  let currentID = req.body.id;
  let newText = req.body.text;
  let objectToChange = findObjectById(currentID);

  if (objectToChange) {
    objectToChange.text = newText;
    res.status(200).json({ "ok" : true });
  } else {
    res.status(404).json({ message: "Object not found." });
  }

});

server.delete("/api/v1/items", (req, res) =>{
  let currentID = req.body.id;

  

  if (findObjectById(currentID)) {
    removeObjectById(currentID);
    res.status(200).json({ "ok" : true });
  } else {
    res.status(404).json({ message: "Object not found." });
  }

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

function findObjectById(id: number): Item | undefined {
  return items.find((obj) => obj.id === id);
}

function removeObjectById(id: number): void {
  const index = items.findIndex((obj) => obj.id === id);

  if (index !== -1) {
    items.splice(index, 1);
  }
}
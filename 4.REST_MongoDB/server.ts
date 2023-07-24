import express from 'express';

const port = 8080;
const server = express();

server.listen(port, () => {
  console.log("Listening on port:", port);
}).on("error", (err: Error) => {
  console.log("ERROR:", err);
});

server.get("/", (req, res) => {
  res.send("<h1>HELLO!!!</h1>");
  console.log(req.url);

})
.post("/", (req, res)=>{})
.patch("/", (req, res)=>{})
.put("/", (req, res)=>{})
.delete("/", (req, res)=>{});

server.get("/old",(req, res) => {
  res.redirect("/new")
});

server.get("/new",(req, res) => {
  res.send("<h2>NEEEE!!!</h2>");
});
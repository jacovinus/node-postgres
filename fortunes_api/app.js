const express = require("express");
const bodyParser = require("body-parser");
const fortunes = require("./data/fortunes");
const users = require("./data/users");
const fs = require("fs");
const app = express();

const fileRoute = "./data/fortunes.json";
const usersRoute = "./data/users.json";
app.use(bodyParser.json());
// Fortunes list
app.get("/", (req, res) => {
  res.json(fortunes);
});
// Fortunes list with route
app.get("/fortunes", (req, res) => {
  res.json(fortunes);
});
// Get a random fortune
app.get("/fortunes/random", (req, res) => {
  res.json(fortunes[Math.floor(Math.random() * fortunes.length)]);
});
// Get a specific fortune
app.get("/fortunes/:id", (req, res) => {
  res.json(fortunes.find(f => f.id == req.params.id));
});
// write fortune into json DB
const writeFortunes = json => {
  fs.writeFile(fileRoute, JSON.stringify(json), err => {
    console.log(err);
  });
};
const writeUsers = json => {
  fs.writeFile(usersRoute, JSON.stringify(json), err=>{
    console.log(err);
  })
}
// post new fortune
app.post("/fortunes", (req, res) => {

  const { message, lucky_number, spirit_animal, lucky_color } = req.body;
  const fortune_ids = fortunes.map(f => f.id);
  const new_fortunes = fortunes.concat({
    id: (fortune_ids.length > 0 ? Math.max(...fortune_ids) : 0) + 1,
    message,
    lucky_number,
    spirit_animal,
    lucky_color
  });
  writeFortunes(new_fortunes);
  res.json(new_fortunes);
});
// Update specific fortune
app.put("/fortunes/:id", (req, res) => {
  const { id } = req.params;
  const old_fortune = fortunes.find(f => f.id == id);
  if (!old_fortune) return res.status(404).send({ error: "fortune not found" });
  ["message", "lucky_number", "spirit_animal", "lucky_color"].forEach(key => {
    if (req.body[key]) old_fortune[key] = req.body[key];
  });
  writeFortunes(fortunes);
  res.json(fortunes);
});
// Delete specific fortune
app.delete("/fortunes/:id", (req, res) => {
  const { id } = req.params;
  const old_fortune = fortunes.find(f => f.id == id);
  if (!old_fortune) return res.status(404).send({ error: "fortune not found" });
  const new_fortunes = fortunes.filter(f => f.id != id);
  writeFortunes(new_fortunes);
  res.json(new_fortunes);
});

// users list 
app.get("/users", (req, res) => {
  res.json(users);
});
app.get("/users/:id", (req, res) => {
const {id} = req.params;
res.json(users.find(f=> f.id == id));
});
app.post("/users",(req,res)=>{
const { name, age, city, mascot } = req.body;
const user_ids = users.map(f => f.id);
const user_nicks = users.find(f=>f.username == req.body.username);
const id = (user_ids.length > 0 ? Math.max(...user_ids): 0) + 1;
const username = user_nicks ? req.body.username.concat((id)): req.body.username;
const new_users = users.concat({
  id, 
  username, 
  name,
  age,
  city,
  mascot
})
writeUsers(new_users);
res.json(new_users);
})
module.exports = app;

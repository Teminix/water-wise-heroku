const express = require('express');
const l = console.log;
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs')
const cors = require('cors');
// const {google} = require("googleapis")
const rocket = require("./core/rocket");
const lib = require("./core/lib")
const Routers = {
  "main":require("./routers/main")
};
const PORT = process.env.PORT || 9000
app.use(rocket.tools)
app.use(cors())
app.use(rocket.logger);
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(bodyParser.text())
lib.plugRouters(Routers,app,"/api/")
// API comment
app.get("/",(req,res) => {
  // res.send("Welcome to API")
  // res.file("public/index.html")
  if (fs.existsSync("public/index.html")) {
    res.file("public/index.html")
  } else {
    res.send("Welcome to the website")
  }
})

app.get("/*",(req,res) => {
  // res.send(`Invalid GET route "${req.path}"`)
  let path = req.path;
  path = path.replace(new RegExp("%20","g")," ")
  if(fs.existsSync("public/"+path)){
    res.file('public/'+path)
    l('test')
  } else if (path[0]=="."){
    res.send("'.' files are forbidden")
  } else {
    res.status(404)
    l(path)
    res.file("html/404.html")
  }
})
app.post("/*",(req,res) => {
  res.send(`Invalid POST route "${req.path}"`)
})

app.listen(PORT,() => {
  l("Server running on "+PORT)
})

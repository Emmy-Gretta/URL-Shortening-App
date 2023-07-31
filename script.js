const { log } = require('console');
const express = require('express');
const mysql =require('mysql');

const app = express();

app.use(express.static("public"));

const conn = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'Shorturls'
});
conn.connect((err) => {
   if(err){
      console.log(err.message);
   }
})

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000);
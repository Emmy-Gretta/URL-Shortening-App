const { log } = require('console');
const express = require('express');
const mysql =require('mysql');

const app = express();
const port = 3002;

app.use(express.static("public"));
app.use(express.json());

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

app.post("/api/create-short-url", (req, res) => {
   let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substr(0, 10);
   let sql =  `INSERT INTO links (longUrl,ShortUrlId) VALUES('${req.body.longUrl}', '${uniqueID}')`;
   conn.query(sql, function(err, result) {
      if(err){
         res.status(500).json({
            status:"Not Ok",
            message: err.message
         });
      }else{
         res.status(200).json({
            status: "Ok",
            shortUrlId: uniqueID
         });
      }
   })
})

app.get("/api/get-all-short-urls",(req,res) => {
   let sql = `SELECT * FROM links`;
   conn.query(sql, (err, result) => {
      if(err){
         res.status(500).json({
            status: "Not Ok",
            message: err.message
         });
      }else{
         res.status(200).json({result});
      }
   })
})

app.get("/:shortUrlId", (req,res) => {
   let shortUrlId = req.params.shortUrlId;
   let sql = `SELECT * FROM links WHERE shortUrlId ='${shortUrlId}' LIMIT 1`;
   conn.query(sql, (err, result) => {
      if(err){
         res.status(500).json({
            status: "Not Ok",
            message: err.message
         })
      }else{
         sql = `UPDATE links SET count = ${result[0].count+1} WHERE id='${result[0].id}' LIMIT 1`;
         conn.query(sql, (err, result) => {
            if(err){
               res.status(500).json({
                  status: "Not Ok",
                  message: err.message
               })
            }else{
               res.redirect(result[0].longUrl);
            }
         })
      }
   })
})

app.listen(port, (err, result) => {
   console.log(`server listening on http://localhost:${port}`);
})
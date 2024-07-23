import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import db from './databaseconnections.js';

const app = express();
app.use(cors());
const port = 5000;


app.use(bodyParser.json()); 

app.get('/',(req, res) => {
  res.send("welcome to our website")
});

app.post('/app/signup',(req,res)=>{
    const { username, password } = req.body;
    const query = "insert into users (username,password) values(?,?)";
    db.query(query,[username,password],(err,ress)=>{
        if(err){
            return res.sendStatus(500).json("error registering user");
        }
        res.json("user registered successfully");
    });
});

app.post('/app/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    const query = "SELECT password FROM users WHERE username = ?";
  
    db.query(query, [username], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error finding password" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Username does not exist" });
      }
  
      const storedPassword = results[0].password;
  
      if (storedPassword === password) {
        return res.status(200).json({ message: "Password matched" });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    });
  });

app.get('/app/home', (req, res) => {
    const query = `
    SELECT p.post_id , p.user_id ,u.username , p.attachment ,p.post_text ,
    SUM(CASE WHEN c.final_severity = 'positive' THEN 1 ELSE 0 END) as positive,
    SUM(CASE WHEN c.final_severity = 'negative' THEN 1 ELSE 0 END) as negative
    FROM posts as p
    left join comments as c on p.post_id=c.post_id
    join users as u on u.user_id=p.user_id
    group by post_id
    order by post_id`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving posts:', err);
            return res.status(500).json({ message: "Error retrieving posts" });
        }
        res.status(200).json(results);
    });
});


app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
  });
  
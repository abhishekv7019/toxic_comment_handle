import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import multer from 'multer';
import db from './databaseconnections.js';

const app = express();
app.use(cors());
const port = 5000;


app.use(bodyParser.json()); 
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.get('/',(req, res) => {
  res.send("welcome to our website")
});

app.post('/app/signup', (req, res) => {
  const { username, password } = req.body;
  const query1 = "SELECT COUNT(*) AS count FROM users WHERE username=?";

  db.query(query1, [username], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Database error while checking username" });
    }
    if (result[0].count > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: "Error registering user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});

app.post('/upload', upload.single('image'), (req, res) => {
  const postText = req.body.postText;
  const { buffer } = req.file;
  const username = req.body.username;


  const query1 = 'SELECT user_id FROM users WHERE username = ?';
  db.query(query1, [username], (err, resultt) => {
    if (err) {
      return res.status(500).json({ error: 'Error occurred while fetching user ID' });
    }

    if (resultt.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user_id = resultt[0].user_id;

    // Insert post into the database
    const query = 'INSERT INTO posts (user_id, post_text, image_data) VALUES (?, ?, ?)';
    db.query(query, [user_id, postText, buffer], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while inserting post' });
      }
      res.status(200).json({ message: 'Post created successfully' });
    });
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
      SELECT p.post_id, p.user_id, u.username, 
        CASE 
          WHEN p.image_data IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', TO_BASE64(p.image_data)) 
          ELSE NULL 
        END AS image_data,
        p.post_text,
        SUM(CASE WHEN c.final_severity = 'positive' THEN 1 ELSE 0 END) AS positive,
        SUM(CASE WHEN c.final_severity = 'negative' THEN 1 ELSE 0 END) AS negative
      FROM posts AS p
      LEFT JOIN comments AS c ON p.post_id = c.post_id
      JOIN users AS u ON u.user_id = p.user_id
      GROUP BY p.post_id
      ORDER BY p.post_id`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving posts:', err);
        return res.status(500).json({ message: "Error retrieving posts" });
      }
      res.status(200).json(results);
    });
  });
  

  app.post('/postspecifipage', (req, res) => {
    const { post_id } = req.body; // Extract post_id from the request body

    if (!post_id) {
        return res.status(400).json({ error: 'Post ID is required' });
    }

    // Query to get post details
    const postQuery = `
        SELECT p.post_id, p.user_id, u.username,
            CASE 
                WHEN p.image_data IS NOT NULL THEN CONCAT('data:image/jpeg;base64,', TO_BASE64(p.image_data)) 
                ELSE NULL 
            END AS image_data,
            p.post_text,
            SUM(CASE WHEN c.final_severity = 'positive' THEN 1 ELSE 0 END) AS positive,
            SUM(CASE WHEN c.final_severity = 'negative' THEN 1 ELSE 0 END) AS negative
        FROM posts AS p
        LEFT JOIN comments AS c ON p.post_id = c.post_id
        JOIN users AS u ON u.user_id = p.user_id
        WHERE p.post_id = ?
        GROUP BY p.post_id
        ORDER BY p.post_id`;

    // Query to get comments with user information
    const commentsQuery = `
        SELECT c.comment_id, c.comment_text, c.user_id, c.final_severity, u.username
        FROM comments AS c
        JOIN users AS u ON c.user_id = u.user_id
        WHERE c.post_id = ?
        ORDER BY c.user_id`;

    // Execute the first query to get post details
    db.query(postQuery, [post_id], (err, postResult) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while fetching post details' });
        }

        // Execute the second query to get comments
        db.query(commentsQuery, [post_id], (err, commentsResult) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while fetching comments' });
            }

            // Combine the results
            const response = {
                post: postResult[0], // Assuming there's only one post result
                comments: commentsResult
            };

            // Send the combined response
            res.status(200).json(response);
        });
    });
});


app.post('/api/submit_comments', (req, res) => {
  const { comment, username, postId } = req.body;
  console.log("i am here")
  if (!comment || !username) {
    return res.status(400).json({ error: 'Comment and username are required' });
  }

  const query1 = "SELECT user_id FROM users WHERE username = ?";
  db.query(query1, [username], (errr, ress) => {
    if (errr) {
      return res.status(500).json({ error: 'Error fetching user ID' });
    }

    if (ress.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const userId = ress[0].user_id;

    const modelResult = {
      toxic: Math.random(),
      severe_toxic: Math.random(),
      obscene: Math.random(),
      threat: Math.random(),
      insult: Math.random(),
      identity_hate: Math.random(),
    };

    const maxValue = Math.max(...Object.values(modelResult));
    console.log('Maximum value:', maxValue);

    // Adjust threshold for final severity
    const finalSeverity = maxValue > 0.3 ? "positive" : "negative";

    const query = `INSERT INTO comments (
      comment_text, final_severity, user_id, toxic, severe_toxic, obscene, threat, insult, identity_hate, post_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
      comment,
      finalSeverity,
      userId,
      modelResult.toxic,
      modelResult.severe_toxic,
      modelResult.obscene,
      modelResult.threat,
      modelResult.insult,
      modelResult.identity_hate,
      postId
    ], (err, results) => {
      if (err) {
        console.error('Error inserting comment:', err);
        return res.status(500).json({ error: 'Failed to post comment' });
      }
      res.status(201).json({ message: 'Comment posted successfully', id: results.insertId });
    });
  });
});


app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
  });
  
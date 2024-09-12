const express = require('express');
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/register", async(req, res)=> {
  const {username, password, email, number} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(passwprd, 10);
    
    const result = await pool.query('INSERT INTO drivers (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

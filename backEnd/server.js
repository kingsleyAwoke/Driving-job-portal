const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.post("/register", async(req, res)=> {
  const {username, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
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

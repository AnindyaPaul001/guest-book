const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM messages ORDER BY id DESC');
  let messages = result.rows.map(msg => `<p><strong>${msg.name}</strong>: ${msg.message}</p>`).join('');
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/submit', async (req, res) => {
  const { name, message } = req.body;
  await pool.query('INSERT INTO messages (name, message) VALUES ($1, $2)', [name, message]);
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

app.use(cors());

app.use(express.json());


app.get('/items', async (req, res) => {
  const items = await pool.query('SELECT * FROM items');
  res.json(items);
});

app.post('/items', async (req, res) => {
  const item = req.body;
  await pool.query('INSERT INTO items SET name = ?, description = ?', [item.name, item.description]);
  res.json({ success: true });
});

app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  const item = req.body;
  await pool.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [item.name, item.description, id]);
  res.json({ success: true });
});

app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM items WHERE id = ?', [id]);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log(`Server listening on port ${3000}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'microservicesdb',
  port: 5432
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      item VARCHAR(100),
      qty INTEGER,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}
init().catch(err => console.error('Init order-service DB error:', err.message));

app.post('/orders', async (req, res) => {
  const { user_id, item, qty } = req.body;
  try {
    // Validación simple consultando user-service
    const userResp = await axios.get(`http://user-service:3001/users/${user_id}`, { timeout: 3000 });
    if (!userResp.data || !userResp.data.id) {
      return res.status(400).json({ error: 'Usuario no existe' });
    }
    const { rows } = await pool.query(
      'INSERT INTO orders (user_id, item, qty) VALUES ($1, $2, $3) RETURNING *;',
      [user_id, item, qty]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    console.error('Order error:', err.message);
    res.status(500).json({ error: 'Error creando la orden: ' + err.message });
  }
});

app.get('/orders', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders;');
  res.json(rows);
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`order-service listening on ${port}`));

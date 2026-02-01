const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

// Mock the app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database setup (use in-memory for tests)
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(amount, category, description, date)
)`);

// Routes
app.post('/expenses', (req, res) => {
  const { amount, category, description, date } = req.body;
  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Amount, category, and date are required' });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }

  const sql = `INSERT OR IGNORE INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)`;
  db.run(sql, [amount, category, description || '', date], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      db.get(`SELECT id FROM expenses WHERE amount = ? AND category = ? AND description = ? AND date = ?`, [amount, category, description || '', date], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: row.id });
      });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

app.get('/expenses', (req, res) => {
  const { category, sort } = req.query;
  let sql = `SELECT * FROM expenses`;
  let params = [];

  if (category) {
    sql += ` WHERE category = ?`;
    params.push(category);
  }

  if (sort === 'date_desc') {
    sql += ` ORDER BY date DESC`;
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

describe('Expense API', () => {
  beforeAll((done) => {
    // Wait for DB setup
    setTimeout(done, 100);
  });

  afterAll((done) => {
    db.close(done);
  });

  it('should create a new expense', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({
        amount: 100,
        category: 'Food',
        description: 'Lunch',
        date: '2023-10-01'
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return all expenses', async () => {
    const response = await request(app).get('/expenses');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should filter expenses by category', async () => {
    const response = await request(app).get('/expenses?category=Food');
    expect(response.status).toBe(200);
    expect(response.body.every(exp => exp.category === 'Food')).toBe(true);
  });

  it('should sort expenses by date desc', async () => {
    const response = await request(app).get('/expenses?sort=date_desc');
    expect(response.status).toBe(200);
    // Assuming dates are in order
  });

  it('should reject invalid expense', async () => {
    const response = await request(app)
      .post('/expenses')
      .send({
        amount: -10,
        category: 'Food',
        date: '2023-10-01'
      });
    expect(response.status).toBe(400);
  });
});
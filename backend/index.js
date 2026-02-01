const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./expenses.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
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
      // Duplicate, find existing
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
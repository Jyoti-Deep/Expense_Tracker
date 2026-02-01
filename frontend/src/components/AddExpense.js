import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function AddExpense() {
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSuccess('');
    if (parseFloat(form.amount) <= 0) {
      setError('Amount must be positive');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      setSuccess('Expense added successfully!');
      setForm({ amount: '', category: '', description: '', date: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Add New Expense</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          inputProps={{ min: 0.01, step: 0.01 }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={submitting} fullWidth>
          {submitting ? 'Adding...' : 'Add Expense'}
        </Button>
      </Box>
    </Container>
  );
}

export default AddExpense;
import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Button, Box, Alert } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = expenses;
    if (filterCategory) {
      filtered = expenses.filter(e => e.category === filterCategory);
    }
    if (sortDesc) {
      filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredExpenses(filtered);
  }, [expenses, filterCategory, sortDesc]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const categories = [...new Set(expenses.map(e => e.category))];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>All Expenses</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setSortDesc(!sortDesc)}>
          Sort: {sortDesc ? 'Newest First' : 'Oldest First'}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map(exp => (
              <TableRow key={exp.id}>
                <TableCell>{exp.date}</TableCell>
                <TableCell>₹{exp.amount}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{exp.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ mt: 2 }}>Total: ₹{total.toFixed(2)}</Typography>
    </Container>
  );
}

export default ExpensesList;
import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses?sort=date_desc`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
      setTotal(data.reduce((sum, e) => sum + e.amount, 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const recent = expenses.slice(0, 5);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Expense Tracker Dashboard</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Total Expenses: ₹{total.toFixed(2)}</Typography>
        </CardContent>
      </Card>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" component={Link} to="/add" sx={{ mr: 2 }}>Add Expense</Button>
        <Button variant="outlined" component={Link} to="/expenses">View All Expenses</Button>
        <Button variant="outlined" component={Link} to="/summary" sx={{ ml: 2 }}>View Summary</Button>
      </Box>
      <Card>
        <CardContent>
          <Typography variant="h6">Recent Expenses</Typography>
          <List>
            {recent.map(exp => (
              <ListItem key={exp.id}>
                <ListItemText primary={`${exp.category}: ₹${exp.amount}`} secondary={exp.date} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
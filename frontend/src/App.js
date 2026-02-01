import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ExpensesList from './components/ExpensesList';
import Summary from './components/Summary';
import './App.css';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/add">Add Expense</Button>
          <Button color="inherit" component={Link} to="/expenses">Expenses</Button>
          <Button color="inherit" component={Link} to="/summary">Summary</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/expenses" element={<ExpensesList />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  );
}

export default App;

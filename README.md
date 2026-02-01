# Expense Tracker

A full-stack expense tracking application with a Node.js/Express backend and React frontend.

## Tech Stack

- **Backend**: Node.js, Express, SQLite
- **Frontend**: React, Material-UI, React Router
- **Database**: SQLite for simplicity and persistence

## Features

- **Dashboard**: Overview with total expenses and recent entries
- **Add Expense**: Form to create new expenses with validation
- **Expenses List**: View all expenses with filtering by category and sorting by date
- **Summary**: Breakdown of expenses by category
- Handles retries and network issues gracefully
- Responsive UI with Material-UI components

## Design Decisions

- **Backend**: Used Express for quick API setup. SQLite chosen for its simplicity, no setup required, and file-based persistence. For production, a more robust DB like PostgreSQL would be better.
- **Idempotency**: Used UNIQUE constraint on amount, category, description, date to prevent duplicates on retries. This is a simple approach; in production, a request ID or token-based system might be used.
- **Frontend**: React with Material-UI for modern, accessible UI. Divided into screens for better UX. Used React Router for navigation.
- **Validation**: Client-side validation for amount > 0, required fields.

## Trade-offs

- Timeboxed, so no advanced features like authentication, pagination, or advanced validation.
- No automated tests due to time.
- Frontend assumes API is running on localhost:3001.

## Setup

1. Backend:
   - cd backend
   - npm install
   - node index.js

2. Frontend:
   - cd frontend
   - npm install
   - npm start

Open http://localhost:3000 for frontend, backend on 3001.

## API

- POST /expenses: Create expense
- GET /expenses?category=X&sort=date_desc: List expenses
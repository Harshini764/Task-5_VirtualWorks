import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Database from './database.js';

const app = express();
const PORT = 5000;
const db = new Database('./team_availability.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
db.initialize();

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user availability
app.put('/api/users/:id/availability', async (req, res) => {
  try {
    const { available } = req.body;
    if (typeof available !== 'boolean') {
      return res.status(400).json({ error: 'available must be a boolean' });
    }
    
    const success = await db.updateUserAvailability(req.params.id, available);
    if (success) {
      const user = await db.getUserById(req.params.id);
      res.json({ message: 'Availability updated', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (optional, for testing)
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    
    const userId = await db.createUser(name);
    const user = await db.getUserById(userId);
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Team Availability Tracker API running on http://localhost:${PORT}`);
  console.log('Database initialized');
});

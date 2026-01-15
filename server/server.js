require('dotenv').config({ path: './.env.local' });


const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./db');

console.log("MONGODB_URI:", process.env.MONGODB_URI); // DEBUG

app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.use('/api/profile', require('./routes/profile'));
app.use('/api/project', require('./routes/project'));
app.use('/api/blog', require('./routes/blog'));

app.post('/api/proxy', async (req, res) => {
  const { url, method = 'GET', body } = req.body;
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: method === 'GET' ? undefined : JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from React build (dist)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('redis');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// Initialize Redis client
const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

const startServer = async () => {
  try {
    await redisClient.connect(); // Ensure the Redis client is connected
    console.log('Connected to Redis');

    // Initialize an empty TODO list in Redis
    await redisClient.set('todos', JSON.stringify([]));

    // Load route
    app.get('/load', async (req, res) => {
      try {
        const todos = await redisClient.get('todos');
        res.json(JSON.parse(todos || '[]'));
      } catch (err) {
        res.status(500).json({ error: 'Error loading todos' });
      }
    });

    // Save route
    app.post('/save', async (req, res) => {
      const { todos } = req.body;
      try {
        await redisClient.set('todos', JSON.stringify(todos));
        res.json({ status: 'save successful' });
      } catch (err) {
        res.status(500).json({ error: 'Error saving todos' });
      }
    });

    // Clear route
    app.get('/clear', async (req, res) => {
      try {
        await redisClient.set('todos', JSON.stringify([]));
        res.json({ status: 'clear successful' });
      } catch (err) {
        res.status(500).json({ error: 'Error clearing todos' });
      }
    });

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error starting the server:', err);
  }
};

startServer();

require('dotenv').config();
const express = require('express');
const path = require('path');
const { db } = require('./firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'dist')));

// Helper function to log route registrations
const logRoute = (method, path, handler) => {
  console.log(`Registering ${method} route: ${path}`);
  try {
    return app[method.toLowerCase()](path, handler);
  } catch (err) {
    console.error(`Error registering ${method} route: ${path}`, err);
    throw err;
  }
};

// GET route for average rating
logRoute('GET', '/api/ratings/:gameId/average', async (req, res) => {
  try {
    const { gameId } = req.params;
    console.log(`Fetching average rating for gameId: ${gameId}`);
    const ratingsSnapshot = await db.collection('ratings').where('gameId', '==', gameId).get();
    
    if (ratingsSnapshot.empty) {
      return res.json({ averageRating: 0, count: 0 });
    }

    let total = 0;
    let count = 0;
    ratingsSnapshot.forEach(doc => {
      total += doc.data().rating;
      count++;
    });
    const averageRating = Number((total / count).toFixed(1));

    res.json({ averageRating, count });
  } catch (err) {
    console.error('Error fetching average rating:', err);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
});

// POST route to update rating
logRoute('POST', '/api/ratings', async (req, res) => {
  try {
    const { gameId, userId, rating } = req.body;
    console.log(`Updating rating: gameId=${gameId}, userId=${userId}, rating=${rating}`);
    if (!gameId || !userId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    await db.collection('ratings').doc(`${userId}_${gameId}`).set({
      gameId,
      userId,
      rating,
      timestamp: new Date(),
    });

    res.json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

// Handle SPA routing: redirect all requests to index.html
logRoute('GET', '*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Firestore initialized:', !!db);
});
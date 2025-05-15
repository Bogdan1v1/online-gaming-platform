const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const { db } = require('./firebase-admin');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware для перевірки Firebase Auth токена
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Ендпоінт для отримання середнього рейтингу гри
app.get('/api/ratings/:gameId/average', async (req, res) => {
  console.log(`Fetching average rating for gameId: ${req.params.gameId}`);
  try {
    const ratingsSnapshot = await db.collection('ratings')
      .where('gameId', '==', req.params.gameId)
      .get();
    
    if (ratingsSnapshot.empty) {
      return res.json({ averageRating: 0, count: 0 });
    }

    let totalRating = 0;
    let count = 0;
    ratingsSnapshot.forEach(doc => {
      totalRating += doc.data().rating;
      count++;
    });

    const averageRating = (totalRating / count).toFixed(1);
    res.json({ averageRating: parseFloat(averageRating), count });
  } catch (err) {
    console.error('Error fetching average rating:', err);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
});

// Ендпоінт для створення рейтингу
app.post('/api/ratings', authenticate, async (req, res) => {
  console.log(`Updating rating: gameId=${req.body.gameId}, userId=${req.user.uid}, rating=${req.body.rating}`);
  try {
    const { gameId, rating } = req.body;
    if (!gameId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid gameId or rating' });
    }

    const ratingDoc = db.collection('ratings').doc(`${req.user.uid}_${gameId}`);
    await ratingDoc.set({
      gameId,
      userId: req.user.uid,
      rating: parseInt(rating),
      timestamp: new Date(),
    });

    res.json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

// Новий ендпоінт для створення коментаря
app.post('/api/comments', authenticate, async (req, res) => {
  console.log(`Creating comment: gameId=${req.body.gameId}, userId=${req.user.uid}`);
  try {
    const { gameId, comment } = req.body;
    if (!gameId || !comment || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid gameId or comment' });
    }

    const commentDoc = db.collection('comments').doc();
    await commentDoc.set({
      gameId,
      userId: req.user.uid,
      displayName: req.user.name || req.user.email.split('@')[0],
      comment: comment.trim(),
      timestamp: new Date(),
    });

    res.json({ message: 'Comment created successfully', commentId: commentDoc.id });
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Новий ендпоінт для отримання коментарів до гри
app.get('/api/comments/:gameId', async (req, res) => {
  console.log(`Fetching comments for gameId: ${req.params.gameId}`);
  try {
    const commentsSnapshot = await db.collection('comments')
      .where('gameId', '==', req.params.gameId)
      .orderBy('timestamp', 'desc')
      .get();

    const comments = [];
    commentsSnapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });

    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Обробка всіх інших GET-запитів для React SPA
app.get('*', (req, res) => {
  console.log(`Serving SPA for route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
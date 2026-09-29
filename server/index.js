const express = require('express');
const path = require('path');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/books', booksRouter);

// ไม่พบ endpoint ใน /api
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// จัดการ error (เช่น JSON พัง)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
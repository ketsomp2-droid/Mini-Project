const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'books.json');
const STATUSES = ['want-to-read', 'reading', 'finished'];

function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

let books = load();
let nextId = books.reduce((max, b) => Math.max(max, b.id), 0) + 1;

// ตรวจสอบข้อมูล: partial = true สำหรับ PATCH
function validate(body, partial = false) {
  const errors = [];
  const { title, author, category, status, rating } = body;

  if (!partial || title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) errors.push('title is required');
  }
  if (!partial || author !== undefined) {
    if (typeof author !== 'string' || !author.trim()) errors.push('author is required');
  }
  if (category !== undefined && typeof category !== 'string') {
    errors.push('category must be a string');
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  }
  if (rating !== undefined && (!Number.isInteger(rating) || rating < 0 || rating > 5)) {
    errors.push('rating must be an integer between 0 and 5');
  }
  return errors;
}

// GET /api/books?status=&category=&q=
router.get('/', (req, res) => {
  const { status, category, q } = req.query;
  let result = books;

  if (status) result = result.filter(b => b.status === status);
  if (category) {
    result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }
  if (q) {
    const term = q.toLowerCase();
    result = result.filter(b =>
      b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
    );
  }
  res.json(result);
});

// GET /api/books/:id
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST /api/books
router.post('/', (req, res) => {
  const errors = validate(req.body || {});
  if (errors.length) return res.status(400).json({ errors });

  const { title, author, category, status, rating } = req.body;
  const book = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    category: (category || 'General').trim(),
    status: status || 'want-to-read',
    rating: rating ?? 0,
    createdAt: new Date().toISOString()
  };
  books.push(book);
  save();
  res.status(201).json(book);
});

// PATCH /api/books/:id
router.patch('/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const errors = validate(req.body || {}, true);
  if (errors.length) return res.status(400).json({ errors });

  ['title', 'author', 'category', 'status', 'rating'].forEach(field => {
    if (req.body[field] !== undefined) {
      book[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  });
  save();
  res.json(book);
});

// DELETE /api/books/:id
router.delete('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(index, 1);
  save();
  res.status(204).send();
});

module.exports = router;
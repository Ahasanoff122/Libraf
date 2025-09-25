// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join('../db/db.js');

// GET all books
app.get('/books', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath));
  res.json(data.books);
});

// POST new book
app.post('/books', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath));
  const newBook = { id: Date.now().toString(), ...req.body };
  data.books.push(newBook);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json(newBook);
});

// PUT update book
app.put('/books/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath));
  const id = req.params.id;
  const index = data.books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  data.books[index] = { ...data.books[index], ...req.body };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json(data.books[index]);
});

// DELETE book
app.delete('/books/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath));
  data.books = data.books.filter(b => b.id !== req.params.id);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

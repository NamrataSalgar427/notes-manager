const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Path to our JSON "database"
const dataPath = path.join(__dirname, 'data', 'notes.json');

// ─── Helper Functions ──────────────────────────────────

// Read notes from JSON file
function readNotes() {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

// Write notes to JSON file
function writeNotes(notes) {
  fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
}

// ─── Middleware ────────────────────────────────────────

// Parse incoming JSON data
app.use(express.json());

// Serve static files from public folder
app.use(express.static('public'));

// ─── API Routes ───────────────────────────────────────

// GET /api/notes → return all notes
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// POST /api/notes → create a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;

  // Basic validation
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const notes = readNotes();

  // Create new note object
  const newNote = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);
  writeNotes(notes);

  res.status(201).json(newNote);
});

// DELETE /api/notes/:id → delete a note by id
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const notes = readNotes();

  const noteIndex = notes.findIndex(note => note.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  writeNotes(notes);

  res.json({ message: 'Note deleted successfully' });
});

// ─── Page Routes ──────────────────────────────────────

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ─────────────────────────────────────

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function readNotes() {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file is missing or corrupted, return empty array
        return [];
    }
}
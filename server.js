const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE  = 'data.json';
const DIARY_FILE = 'diary.json';

function readJson(file) {
  if (!fs.existsSync(file)) return {};
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return {}; }
}

function writeJson(file, body) {
  fs.writeFileSync(file, JSON.stringify(body, null, 2));
}

// ── Tracker data ──────────────────────────────────
app.get('/data', (req, res) => res.json(readJson(DATA_FILE)));

app.post('/data', (req, res) => {
  writeJson(DATA_FILE, req.body);
  res.json({ status: 'ok' });
});

// ── Diary data ────────────────────────────────────
app.get('/diary', (req, res) => res.json(readJson(DIARY_FILE)));

app.post('/diary', (req, res) => {
  writeJson(DIARY_FILE, req.body);
  res.json({ status: 'ok' });
});

// ── Start ─────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => console.log(`Discipline Tracker running → http://localhost:${PORT}`));
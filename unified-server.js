const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');
const DIARY_FILE = path.join(__dirname, 'diary.json');

app.use(express.json());

// Helper functions
function readJson(file) {
  if (!fs.existsSync(file)) return {};
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return {}; }
}

function writeJson(file, body) {
  fs.writeFileSync(file, JSON.stringify(body, null, 2));
}

// ── API Routes ───
app.get('/data', (req, res) => res.json(readJson(DATA_FILE)));

app.post('/data', (req, res) => {
  writeJson(DATA_FILE, req.body);
  res.json({ status: 'ok' });
});

app.get('/diary', (req, res) => res.json(readJson(DIARY_FILE)));

app.post('/diary', (req, res) => {
  writeJson(DIARY_FILE, req.body);
  res.json({ status: 'ok' });
});

// ── Development: Start Vite dev server ──
if (process.env.NODE_ENV !== 'production') {
  console.log('🚀 Starting in development mode...');
  
  // Start Vite dev server as a child process
  const vite = exec('npm run dev', { 
    cwd: path.join(__dirname, 'habit-tracker-frontend'),
    shell: true 
  });
  
  vite.stdout.on('data', (data) => {
    console.log(`[Vite] ${data}`);
  });
  
  vite.stderr.on('data', (data) => {
    console.error(`[Vite Error] ${data}`);
  });
  
  // Proxy to Vite dev server for frontend routes
  const { createProxyMiddleware } = require('http-proxy-middleware');
  
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true,  // Enable WebSocket for HMR
  }));
  
} else {
  // ── Production: Serve static files ──
  console.log('🚀 Starting in production mode...');
  const distPath = path.join(__dirname, 'habit-tracker-frontend/dist');
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Handle SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.error('❌ Dist folder not found. Run `npm run build` first.');
  }
}

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  Habit Tracker - Unified Server       ║`);
  console.log(`║  🚀 Running on http://localhost:${PORT}     ║`);
  console.log(`║  API: http://localhost:${PORT}/data      ║`);
  console.log(`║  API: http://localhost:${PORT}/diary     ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  console.log(`👉 Open http://localhost:${PORT} in your browser\n`);
});
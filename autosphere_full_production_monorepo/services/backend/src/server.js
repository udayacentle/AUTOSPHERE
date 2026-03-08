const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET = process.env.SECRET || 'AUTOSPHERE_SECRET';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// API: health/info (for programmatic check)
app.get('/api', (req, res) => {
  res.json({
    service: 'AutoSphere Backend',
    status: 'running',
    endpoints: {
      'POST /auth/login': 'Login',
      'GET /vehicles/1': 'Vehicle mobility score',
      'POST /ai/calculate-risk': 'AI risk score',
    },
  });
});

app.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/vehicles/1', (req, res) => {
  res.json({ mobilityScore: 870 });
});

// Proxy to AI service (avoids CORS; Docker: AI_SERVICE_URL=http://ai:8000)
app.post('/ai/calculate-risk', async (req, res) => {
  try {
    const features = Array.isArray(req.body) ? req.body : (req.body.features || []);
    const r = await fetch(`${AI_SERVICE_URL}/calculate-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'AI service unavailable', detail: e.message });
  }
});

// Serve the web app (explicit root so it always works)
const publicDir = path.join(__dirname, '..', 'public');
const indexPath = path.join(publicDir, 'index.html');

app.get('/', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) res.status(500).send('Web app not found. Check server setup.');
  });
});

app.use(express.static(publicDir));

// SPA fallback: any other GET request serves index.html
app.get('*', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});

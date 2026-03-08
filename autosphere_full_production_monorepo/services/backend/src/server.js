const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET = process.env.SECRET || 'AUTOSPHERE_SECRET';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// API: health/info (BRD-aligned)
app.get('/api', (req, res) => {
  res.json({
    service: 'AutoSphere AI - Intelligent Automotive Ecosystem Platform',
    version: '1.0',
    status: 'running',
    endpoints: {
      'POST /auth/login': 'Login',
      'GET /vehicles/1': 'Vehicle + VII (Vehicle Intelligence Index)',
      'GET /api/dashboard': 'Driver dashboard data',
      'GET /api/driver-companion': 'Driver AI Companion module',
      'POST /ai/calculate-risk': 'Insurance AI - dynamic risk scoring',
    },
  });
});

app.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Vehicle + VII (Vehicle Intelligence Index): health, risk, compliance, market (BRD §4)
app.get('/vehicles/1', (req, res) => {
  res.json({
    mobilityScore: 870,
    vehicleName: 'Primary Vehicle',
    healthPercent: 92,
    status: 'Good',
    lastService: '2025-02-15',
    vii: {
      health: 92,
      risk: 18,
      compliance: 95,
      environmental: 88,
      marketValue: 78,
    },
  });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    mobilityScore: 870,
    vehicle: { id: 1, name: 'Primary Vehicle', health: 92, status: 'Good' },
    predictiveMaintenanceAlerts: [
      { id: 1, severity: 'low', message: 'Brake pads at 76% – schedule in 60 days', dueIn: '60 days' },
      { id: 2, severity: 'info', message: 'Next oil change recommended in 30 days', dueIn: '30 days' },
    ],
    recentActivity: [
      { id: 1, type: 'trip', label: 'Trip completed', time: '2 hours ago' },
      { id: 2, type: 'score', label: 'Vehicle Intelligence Index (VII) updated', time: '5 hours ago' },
      { id: 3, type: 'service', label: 'Predictive maintenance: service due in 30 days', time: '1 day ago' },
    ],
  });
});

// Driver AI Companion module (BRD §5): behavior, predictive maintenance, insurance forecast, resale
app.get('/api/driver-companion', (req, res) => {
  res.json({
    drivingBehavior: { score: 85, summary: 'Good', lastUpdated: '2 hours ago' },
    predictiveMaintenanceAlerts: [
      { severity: 'low', message: 'Brake pads – schedule in 60 days', dueIn: '60 days' },
      { severity: 'info', message: 'Oil change in 30 days', dueIn: '30 days' },
    ],
    insuranceForecast: { estimatedPremiumChange: '-5%', riskLevel: 'Low', nextReview: 'Next month' },
    resaleEstimate: { value: 24500, currency: 'USD', trend: 'stable', lastUpdated: '1 week ago' },
  });
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

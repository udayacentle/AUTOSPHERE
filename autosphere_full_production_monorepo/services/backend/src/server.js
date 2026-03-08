require('dotenv').config();

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
  const email = req.body.email || req.body.usernameOrEmail;
  const token = jwt.sign({ email: email || 'user@autosphere.demo' }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Google OAuth: redirect to Google sign-in (configure GOOGLE_CLIENT_ID and BASE_URL to enable)
const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';
app.get('/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.redirect(302, '/?google=unavailable');
  }
  const redirectUri = `${BASE_URL.replace(/\/$/, '')}/auth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  // prompt=select_account shows the device's signed-in Google accounts (account chooser), like GitHub sign-in
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&prompt=select_account`;
  res.redirect(302, url);
});
app.get('/auth/google/callback', (req, res) => {
  const { code, error } = req.query;
  if (error) {
    return res.redirect(302, '/?google_error=' + encodeURIComponent(error));
  }
  if (!code) {
    return res.redirect(302, '/');
  }
  // In production: exchange code for tokens, create/fetch user, set session or return JWT
  const token = jwt.sign({ email: 'google-user@autosphere.demo', provider: 'google' }, SECRET, { expiresIn: '1h' });
  res.redirect(302, '/?token=' + token);
});

// Apple Sign In (placeholder: redirect to app or show “not configured”)
app.get('/auth/apple', (req, res) => {
  // In production: redirect to Apple ID auth; configure APPLE_CLIENT_ID and APPLE_REDIRECT_URI
  const token = jwt.sign({ email: 'apple-user@autosphere.demo', provider: 'apple' }, SECRET, { expiresIn: '1h' });
  res.redirect(302, '/?token=' + token);
});
app.get('/auth/apple/callback', (req, res) => {
  const token = jwt.sign({ email: 'apple-user@autosphere.demo', provider: 'apple' }, SECRET, { expiresIn: '1h' });
  res.redirect(302, '/?token=' + token);
});

// Vehicle + VII (Vehicle Intelligence Index): health, risk, compliance, market (BRD §4)
app.get('/vehicles/1', (req, res) => {
  res.json({
    mobilityScore: 870,
    vehicleName: 'Primary Vehicle',
    healthPercent: 92,
    status: 'Good',
    lastService: '2025-02-15',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    vin: '1HGBH41JXMN109186',
    odometerMi: 12450,
    odometerKm: 20035,
    fuelType: 'Gasoline',
    color: 'Silver',
    licensePlate: 'ABC 1234',
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
      { id: 1, severity: 'low', message: 'Brake pads at 76% – schedule service in 60 days.', dueIn: '60 days', riskLevel: 'low' },
      { id: 2, severity: 'info', message: 'Next oil change recommended in 30 days.', dueIn: '30 days', riskLevel: 'low' },
      { id: 3, severity: 'medium', message: 'Tire tread depth approaching minimum – consider replacement within 90 days.', dueIn: '90 days', riskLevel: 'medium' },
      { id: 4, severity: 'low', message: 'Cabin air filter may need replacement at next service.', dueIn: '45 days', riskLevel: 'low' },
      { id: 5, severity: 'info', message: 'Battery health good; next test at 18 months.', dueIn: '6 months', riskLevel: 'low' },
    ],
    maintenanceRiskSummary: { riskScore: 3.2, riskLevel: 'Low', highCount: 0, mediumCount: 1, lowCount: 4 },
    recentActivity: [
      { id: 1, type: 'trip', label: 'Trip completed', time: '2 hours ago' },
      { id: 2, type: 'score', label: 'Vehicle Intelligence Index (VII) updated', time: '5 hours ago' },
      { id: 3, type: 'service', label: 'Predictive maintenance: service due in 30 days', time: '1 day ago' },
    ],
    drivingReports: {
      weekly: { trips: 8, distanceMi: 142, distanceKm: 228.5, driveTimeMinutes: 320, fuelUsedGal: 5.2, fuelUsedL: 19.7 },
      monthly: { trips: 34, distanceMi: 612, distanceKm: 984.9, driveTimeMinutes: 1380, fuelUsedGal: 22.1, fuelUsedL: 83.7 },
      recentTrips: [
        { date: '2026-03-07', label: 'Commute', distanceMi: 24, distanceKm: 38.6 },
        { date: '2026-03-06', label: 'Errands', distanceMi: 12, distanceKm: 19.3 },
        { date: '2026-03-05', label: 'Highway', distanceMi: 85, distanceKm: 136.8 },
      ],
    },
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

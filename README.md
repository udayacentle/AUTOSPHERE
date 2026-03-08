# AutoSphere AI

**Intelligent Automotive Ecosystem Platform** (aligned with AutoSphere AI BRD v1.0).

Unified ecosystem for drivers, insurance risk intelligence, digital twin vehicle engine, and Vehicle Intelligence Index (VII).

## Repo structure

- **autosphere_full_driver_app** – Flutter driver app (login, dashboard, API client)
- **autosphere_phase_1_driver_app** – Flutter Phase 1 app (splash, dashboard, vehicle details)
- **autosphere_full_production_monorepo** – Backend, AI service, and web app
  - `services/backend` – Node/Express API + web dashboard (run: `node src/server.js` → http://localhost:3002)
  - `ai-services/risk-engine` – Python FastAPI risk API (port 8000)
  - `apps/driver-mobile` – Flutter feature screens

## Quick start (web app)

```bash
cd autosphere_full_production_monorepo/services/backend
npm install
node src/server.js
```

Open **http://localhost:3002** for the dashboard. With Docker: `docker compose up -d` then **http://localhost:3001**.

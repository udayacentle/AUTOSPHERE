# AutoSphere Backend & Web App

## Run the full web application

### Option A: With Docker (recommended)

From the monorepo root:

```bash
docker compose up --build -d
```

Then open in your browser: **http://localhost:3001**

### Option B: Run locally (no Docker)

1. Start the backend (serves the website):

```bash
cd services/backend
npm install
node src/server.js
```

2. Open in your browser: **http://localhost:3002**

3. (Optional) For AI Risk to work, start the AI service in another terminal:

```bash
cd ai-services/risk-engine
pip install -r requirements.txt
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

## Ports

| When using   | Open in browser   |
|--------------|-------------------|
| Docker       | http://localhost:3001 |
| Local node   | http://localhost:3002 |

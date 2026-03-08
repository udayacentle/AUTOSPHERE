
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import numpy as np

app = FastAPI()
model = None

try:
    import joblib
    model = joblib.load("risk_model.pkl")
except Exception as e:
    print(f"Warning: Could not load risk_model.pkl ({e}). Using fallback.")


# Main app URL (backend serves the full web UI)
APP_URL = "http://localhost:3001"

@app.get("/", response_class=HTMLResponse)
def root():
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AutoSphere AI – Open the app</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }}
    .box {{
      background: #1e293b;
      border-radius: 16px;
      padding: 32px;
      max-width: 420px;
      text-align: center;
      border: 1px solid #334155;
    }}
    h1 {{ color: #38bdf8; font-size: 1.5rem; margin: 0 0 12px; }}
    p {{ color: #94a3b8; margin: 0 0 24px; line-height: 1.5; }}
    a {{
      display: inline-block;
      background: #0ea5e9;
      color: #fff;
      padding: 14px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
    }}
    a:hover {{ background: #0284c7; }}
    .note {{ font-size: 0.875rem; margin-top: 20px; color: #64748b; }}
  </style>
</head>
<body>
  <div class="box">
    <h1>AutoSphere AI Risk Engine</h1>
    <p>This is the AI API service. The full web application (login, dashboard, risk calculator) runs on the backend.</p>
    <a href="{APP_URL}">Open AutoSphere web app →</a>
    <p class="note">API docs: <a href="/docs" style="background:transparent;padding:0;color:#38bdf8;">/docs</a></p>
  </div>
</body>
</html>
"""


@app.post("/calculate-risk")
def calculate_risk(features: list[float]):
    arr = np.array(features) if features else np.array([0.0])
    fallback_score = float(np.clip(np.mean(arr) * 10 if len(arr) else 50, 0, 100))
    if model is not None:
        try:
            prediction = model.predict([features])
            return {"risk_score": float(prediction[0])}
        except Exception:
            pass
    return {"risk_score": fallback_score}

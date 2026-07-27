# AI-SOC — Autonomous Security Operations Center

> **Phase 1: Foundation** — Monorepo scaffold with FastAPI backend and Next.js 15 dashboard.

```
ai-soc/
├── backend/          # Python / FastAPI — Core Engine
│   ├── .venv/        # Python virtual environment (gitignored)
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS + router registration
│   │   ├── models.py        # Pydantic v2 domain models (Incident, Health)
│   │   └── routers/
│   │       ├── health.py    # GET /api/health
│   │       └── alerts.py    # GET /api/alerts
│   ├── requirements.txt
│   └── .env
└── frontend/         # Next.js 15 (App Router) — SOC Dashboard
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx     # Main dashboard page
        │   └── globals.css
        ├── components/
        │   ├── HeaderStatusBar.tsx   # Backend health indicator
        │   ├── AlertQueue.tsx        # Inbound alert list
        │   ├── AlertCard.tsx         # Individual alert with severity badge
        │   └── CapabilitiesMatrix.tsx # Module staging sidebar
        ├── lib/
        │   └── api.ts       # Typed fetch wrappers
        └── types/
            └── index.ts     # Shared TypeScript types
```

---

## Quick Start

### 1. Start the FastAPI Backend

```powershell
cd ai-soc\backend

# Activate the virtual environment
.venv\Scripts\Activate.ps1
# (if PS execution policy blocks this, use:)
# cmd /c ".venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be live at **http://localhost:8000**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. Start the Next.js Frontend

```powershell
cd ai-soc\frontend
npm run dev
```

Dashboard will be live at **http://localhost:3000**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Liveness probe — returns status + UTC timestamp |
| `GET` | `/api/alerts` | Alert queue — returns sorted list of mock incidents |
| `GET` | `/docs` | Swagger UI (FastAPI auto-generated) |

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **1** | Foundation — REST API + Dashboard | ✅ Complete |
| **2** | Authentication (JWT/OAuth2), PostgreSQL/TimescaleDB | 🔜 Planned |
| **3** | Multi-Agent Core (LangGraph orchestration) | 🔜 Planned |
| **4** | Windows Event Tailer + Packet Sniffer sensors | 🔜 Planned |
| **5** | MITRE ATT&CK TTP Mapper + Remediation Playbooks | 🔜 Planned |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | FastAPI 0.115 |
| Data Validation | Pydantic v2 |
| ASGI Server | Uvicorn (with `uvloop` on Linux/Mac) |
| Frontend Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | Python 3.11+ · TypeScript 5 |

# Cryptography CTF Challenges

Full-stack CTF solving workspace with a React/Vite frontend and FastAPI backend.

## Features

- Paste challenge text or upload files from the solve workspace.
- Stream backend solve steps into collapsible frontend output.
- Highlight `flag{...}`-style tokens.
- Reveal progressive hints without losing the current solve state.
- Store solve history in SQLite for local writeups and review.
- Start with RSA helpers for GCD, modular inverse, simple factor checks, and low-exponent recovery.

## Project Layout

```text
frontend/
  src/components/       UI controls for input, category selection, steps, flags, and hints
  src/pages/            Solve, History, and Explore views
  src/hooks/            streaming solver and React Query history hooks
  src/api/              fetch wrapper
backend/
  routes/               FastAPI route modules
  db/                   SQLite connection and history persistence
  crypto_utils.py       RSA helpers and quick solve logic
  executor.py           bounded Python snippet runner
  file_parser.py        text, PDF, and binary upload parsing
docker-compose.yml      backend, frontend, and optional sandbox profile
```

## Run The Entire Project

You can run the app either directly on your machine or with Docker Compose. For local development, use two terminals: one for the FastAPI backend and one for the Vite frontend.

### Prerequisites

- Python 3.11 or newer
- Node.js 20 or newer
- npm
- Docker Desktop, only if you want the Docker workflow

### 1. Start The Backend

Run these commands from the repository root:

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open. The backend will be available at:

- API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

If PowerShell blocks activation scripts, use the venv Python directly:

```powershell
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Start The Frontend

Open a second terminal from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the app at:

```text
http://127.0.0.1:5173
```

If PowerShell blocks `npm`, run the Windows command shim instead:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

### 3. Try The RSA Sample

Paste this into the Solve page with the `Crypto` category selected:

```text
n1 = 11413
n2 = 12827
e = 17
c = 10569
Submit your answer in the format: flag{plaintext}
```

The expected result is:

```text
flag{2026}
```

### 4. Stop Local Servers

Press `Ctrl+C` in both terminals.

## Docker Compose

From the repository root:

```powershell
docker compose up --build
```

Then open:

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`
- Backend docs: `http://127.0.0.1:8000/docs`

Stop the Docker services with:

```powershell
docker compose down
```

To start the optional isolated Python shell profile for experiments:

```powershell
docker compose --profile sandbox run --rm sandbox
```

## Validation Commands

Backend syntax check:

```powershell
backend\.venv\Scripts\python.exe -m compileall backend
```

Frontend production build:

```powershell
cd frontend
npm run build
```

## RSA Input Format

The crypto solver recognizes assignments such as:

```text
n = 3233
e = 17
c = 855
p = 61
q = 53
```

PDF upload support uses `pypdf` when installed. If extraction fails, paste the RSA parameters from the PDF into the editor.

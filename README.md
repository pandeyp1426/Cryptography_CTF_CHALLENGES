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

Folder-specific README files:

```text
backend/README.md                 backend architecture and solve flow
backend/solvers/README.md         topic ownership map for teammate solver work
backend/solvers/crypto/README.md  crypto solver module guide
backend/solvers/files/README.md   ZIP/LUKS/file solver guide
frontend/README.md                frontend file map and UI update guide
```

## Challenge Focus

The project is focused on the crypto challenge set from the team board, not general CTF categories like Web or Pwn. Current solver status:

| Challenge | Difficulty | Solver status |
| --- | --- | --- |
| RSA Shared Prime Attack | Medium | Implemented |
| RSA Cracking | Medium | Partial |
| Binary Data Preview | Utility | Partial |
| Wiener's Attack On RSA | Hard | Planned |
| Affine Cipher | Medium | Planned |
| Permutation Cipher | Easy | Planned |
| Vigenere Cipher | Easy | Planned |
| Custom Vigenere | Easy | Planned |
| Hill Cipher | Medium | Planned |
| Frequency Analysis | Medium | Planned |
| 4 Layer Mutation Cypher | Medium | Planned |
| One Time Pad Key Reuse | Medium | Planned |
| DES Cracking | Hard | Planned |
| Meet In The Middle On Double Encryption | Hard | Planned |
| DES Meet In The Middle | Hard | Planned |
| Break The Hash | Easy | Planned |
| ECDSA And Blockchain | Hard | Planned |
| Password Protected ZIP File | Medium | Planned |
| LUKS Encryption | Hard | Planned |

Implemented means the backend can solve at least one real version of that challenge type today. Partial means the app has supporting logic but not a complete challenge solver yet. Planned means the Explore page tracks the challenge, but backend logic still needs to be added.

## Team Development Guide

Start with this root `README.md` for setup and project status. For coding details, use the folder-specific README that matches your work area.

Most teammate work should happen in the backend first. The frontend already sends challenge text/files to `POST /solve` and renders whatever steps, hints, artifacts, and flag the backend returns.

### How The Solve Flow Works

```text
frontend/src/pages/Solve.jsx
  -> frontend/src/hooks/useSolver.js
  -> frontend/src/api/client.js
  -> POST http://127.0.0.1:8000/solve
  -> backend/routes/solve.py
  -> backend solver logic
  -> streamed solve steps back to the UI
```

The response shape each solver should produce is:

```python
{
    "category": "crypto",
    "status": "solved" or "needs-review",
    "flag": "flag{...}" or None,
    "steps": [
        {
            "title": "Step title",
            "body": "What happened",
            "code": "optional values, equations, or plaintext",
            "kind": "analysis" or "success" or "warning" or "flag",
        }
    ],
    "hints": ["next thing to try"],
    "artifacts": {"key": "value"},
}
```

### Where To Code By Topic

For now, RSA code lives in `backend/crypto_utils.py`. As the project grows, split new work into `backend/solvers/crypto/` modules and have `backend/routes/solve.py` call them. The table below shows the intended ownership.

| Topic | Teammate should code here | Also update | Notes |
| --- | --- | --- | --- |
| RSA Shared Prime Attack | `backend/crypto_utils.py` | `README.md`, `frontend/src/pages/Explore.jsx` | Already implemented. Improve tests/examples if needed. |
| RSA Cracking | `backend/crypto_utils.py` now, later `backend/solvers/crypto/rsa.py` | `README.md` working examples | Covers p/q, d, small factors, low exponent. |
| Wiener's Attack On RSA | `backend/solvers/crypto/rsa.py` | `backend/routes/solve.py`, `frontend/src/pages/Explore.jsx`, `README.md` | Use continued fractions to recover small `d`. |
| Affine Cipher | `backend/solvers/crypto/classical.py` | `backend/routes/solve.py`, `README.md` examples | Brute force valid `a,b` keys and rank plaintext. |
| Permutation Cipher | `backend/solvers/crypto/classical.py` | `backend/routes/solve.py`, `README.md` examples | Recover or apply block permutation keys. |
| Vigenere Cipher | `backend/solvers/crypto/vigenere.py` | `backend/routes/solve.py`, `README.md` examples | Estimate key length and decrypt. |
| Custom Vigenere | `backend/solvers/crypto/vigenere.py` | `README.md` examples | Add options for alphabet/rule variants. |
| Hill Cipher | `backend/solvers/crypto/hill.py` | `backend/routes/solve.py`, `README.md` examples | Matrix math modulo alphabet size. |
| Frequency Analysis | `backend/solvers/crypto/frequency.py` | `README.md` examples | Score substitutions using English frequency. |
| 4 Layer Mutation Cypher | `backend/solvers/crypto/mutation.py` | `README.md` examples | Try decode pipelines and show intermediate layers. |
| One Time Pad Key Reuse | `backend/solvers/crypto/otp.py` | `README.md` examples | XOR ciphertexts and support crib dragging. |
| DES Cracking | `backend/solvers/crypto/des.py` | `backend/requirements.txt`, `README.md` examples | Add dependency only if needed. Keep keyspaces realistic. |
| Meet In The Middle | `backend/solvers/crypto/mitm.py` | `README.md` examples | Build forward/reverse lookup tables. |
| Break The Hash | `backend/solvers/crypto/hashes.py` | `README.md` examples | Identify hash type and test candidate words. |
| ECDSA And Blockchain | `backend/solvers/crypto/ecdsa.py` | `backend/requirements.txt`, `README.md` examples | Start with nonce reuse and signature math. |
| Password Protected ZIP | `backend/solvers/files/zip_solver.py` | `backend/file_parser.py`, `README.md` examples | Inspect ZIP metadata and try dictionary candidates. |
| LUKS Encryption | `backend/solvers/files/luks.py` | `README.md` examples | Parse header info; document external cracking steps safely. |
| Binary Data Preview | `backend/file_parser.py` | `frontend/src/pages/Explore.jsx` | Already has a basic hex preview for unknown binary uploads. |

### Suggested Backend Folder Layout

Use this structure for new solver work:

```text
backend/
  solvers/
    crypto/
      rsa.py
      classical.py
      vigenere.py
      hill.py
      frequency.py
      mutation.py
      otp.py
      des.py
      mitm.py
      hashes.py
      ecdsa.py
    files/
      zip_solver.py
      luks.py
```

Each solver file should expose one clear function, for example:

```python
def solve_vigenere(challenge_text: str) -> dict:
    ...
```

Then wire it into `backend/routes/solve.py` or a shared dispatcher.

### What To Update When A Topic Starts Working

When a teammate finishes a solver, update these places:

1. `backend/...`: the solver implementation.
2. `backend/routes/solve.py`: route or dispatch logic, if needed.
3. `README.md`: add a copy-paste working example with expected output.
4. `frontend/src/pages/Explore.jsx`: change status from `Planned` to `Partial` or `Implemented`.
5. `backend/requirements.txt`: only if the solver needs a new Python package.

### Definition Of Done

A challenge topic is `Implemented` when:

- the Solve page can accept a realistic challenge input,
- the backend returns clear solve steps,
- the backend returns the expected flag or plaintext,
- the README has a working copy-paste example,
- `npm.cmd run build` passes,
- `backend\.venv\Scripts\python.exe -m compileall backend` passes.

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

## Working Challenge Examples

These examples work with the current backend solver. For each one, open the Solve page, select `Crypto`, paste the challenge text, and click `Solve`.

### 1. Shared Prime RSA

This is the RSA weakness used by the included `RSA_PROBLEM.pdf`. The two moduli share a prime factor, so the solver computes `gcd(n1, n2)`, factors `n1`, computes `d`, and decrypts `c`.

Paste:

```text
n1 = 11413
n2 = 12827
e = 17
c = 10569
Submit your answer in the format: flag{plaintext}
```

Expected flag:

```text
flag{2026}
```

Expected solve path:

```text
gcd(11413, 12827) = 101
n1 = 101 * 113
phi = 11200
d = 3953
m = 2026
```

### 2. RSA With p And q Provided

This challenge gives the prime factors directly. The solver computes `phi`, finds the modular inverse of `e`, and decrypts the ciphertext.

Paste:

```text
p = 61
q = 53
e = 17
c = 855
Submit your answer in the format: flag{plaintext}
```

Expected flag:

```text
flag{123}
```

Expected solve path:

```text
n = 3233
phi = 3120
d = 2753
m = 123
```

### 3. RSA With Private Exponent Provided

This challenge gives `d`, so the solver can decrypt directly with `m = c^d mod n`.

Paste:

```text
n = 3233
e = 17
d = 2753
c = 855
Submit your answer in the format: flag{plaintext}
```

Expected flag:

```text
flag{123}
```

Expected solve path:

```text
m = pow(c, d, n)
m = 123
```

### 4. Low Exponent Exact Root

This challenge uses a small exponent and a ciphertext that is an exact cube. Since no modular wraparound happened, the solver recovers the plaintext by taking the integer cube root.

Paste:

```text
e = 3
c = 1860867
Submit your answer in the format: flag{plaintext}
```

Expected flag:

```text
flag{123}
```

Expected solve path:

```text
integer_nth_root(1860867, 3) = 123
```

### 5. Direct Flag Detection

This checks the flag highlighter without needing RSA math.

Paste:

```text
After decoding the final payload, the answer is flag{direct_detection_works}
```

Expected flag:

```text
flag{direct_detection_works}
```

### 6. Direct Message Integer

This challenge provides the plaintext integer directly as `m`. The solver converts it to bytes, applies the requested flag format, and reports the result.

Paste:

```text
m = 123
Submit your answer in the format: flag{plaintext}
```

Expected flag:

```text
flag{123}
```

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

# Backend

FastAPI backend for parsing challenges, running solver logic, streaming solve steps, and saving history.

## Main Files

```text
backend/
  main.py              FastAPI app setup and router registration
  routes/solve.py      POST /solve endpoint and streaming response logic
  routes/history.py    GET/POST history endpoints
  crypto_utils.py      Current RSA solver helpers and implemented RSA attacks
  file_parser.py       Text, PDF, and binary upload parsing
  executor.py          Bounded Python snippet runner
  db/database.py       SQLite setup and history queries
  db/models.py         History data model
  solvers/             New solver modules should go here
```

## Backend Solve Flow

```text
POST /solve
  -> backend/routes/solve.py
  -> parse uploaded file with backend/file_parser.py
  -> choose solver based on category/topic
  -> return streamed JSON lines:
     status -> step -> step -> complete
```

## Current Working Solver

The implemented solver logic is currently in:

```text
backend/crypto_utils.py
```

It supports:

- RSA shared-prime attack using `gcd(n1, n2)`
- RSA with provided `p` and `q`
- RSA with provided private exponent `d`
- small-factor trial division for small RSA examples
- exact low-exponent root checks
- direct flag detection

## Where New Backend Work Goes

New challenge solvers should be added under:

```text
backend/solvers/
```

Use the topic map in [backend/solvers/README.md](solvers/README.md).

For example:

```text
backend/solvers/crypto/vigenere.py
backend/solvers/crypto/otp.py
backend/solvers/files/zip_solver.py
```

Then wire the solver into:

```text
backend/routes/solve.py
```

## Solver Return Shape

Every solver should return this shape:

```python
{
    "category": "crypto",
    "status": "solved",
    "flag": "flag{example}",
    "steps": [
        {
            "title": "Parsed input",
            "body": "Found the values needed for the attack.",
            "code": "n = ...",
            "kind": "analysis",
        }
    ],
    "hints": ["Try checking for reused primes."],
    "artifacts": {"plaintextPreview": "example"},
}
```

Valid `kind` values used by the frontend:

```text
analysis
success
warning
flag
```

## Run Backend

From the repository root:

```powershell
backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Docs:

```text
http://127.0.0.1:8000/docs
```

## Validate Backend

```powershell
backend\.venv\Scripts\python.exe -m compileall backend
```


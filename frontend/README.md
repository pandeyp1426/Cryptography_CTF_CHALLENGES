# Frontend

React/Vite frontend for the CTF solver.

## Main Files

```text
frontend/
  src/App.jsx                  Top-level navigation
  src/pages/Solve.jsx          Main challenge solving workspace
  src/pages/History.jsx        Saved solve history
  src/pages/Explore.jsx        Challenge roadmap and solver status
  src/components/              Reusable UI components
  src/hooks/useSolver.js       Streaming solve state
  src/hooks/useHistory.js      React Query history loading
  src/api/client.js            Backend API wrapper
```

## Frontend Solve Flow

```text
Solve.jsx
  -> useSolver.js
  -> api/client.js
  -> POST http://127.0.0.1:8000/solve
  -> streamed backend events
  -> SolveSteps, FlagOutput, HintPanel, Artifacts
```

## Where To Change UI

| UI area | File |
| --- | --- |
| Main solve page layout | `src/pages/Solve.jsx` |
| Challenge text editor and upload button | `src/components/ChallengeInput.jsx` |
| Challenge-family buttons | `src/components/CategorySelector.jsx` |
| Step-by-step output | `src/components/SolveSteps.jsx` |
| Flag display | `src/components/FlagOutput.jsx` |
| Progressive hints | `src/components/HintPanel.jsx` |
| History page | `src/pages/History.jsx` |
| Challenge roadmap/status cards | `src/pages/Explore.jsx` |
| Backend URL and fetch logic | `src/api/client.js` |

## Updating Challenge Status

When a teammate implements a backend solver, update:

```text
src/pages/Explore.jsx
```

Change the challenge from:

```text
Planned
```

to:

```text
Partial
```

or:

```text
Implemented
```

Use the same status wording as the root README.

## Challenge-Family Buttons

The Solve page selector is intentionally crypto-focused. It should not show generic Web/RE/Pwn categories unless the project scope changes.

Current buttons:

```text
RSA
Classical
Analysis
OTP/DES
Hashes
Files
```

These map to the challenge groups in `src/pages/Explore.jsx` and to the backend solver roadmap in `backend/solvers/README.md`.

## Run Frontend

From the repository root:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Validate Frontend

```powershell
cd frontend
npm.cmd run build
```

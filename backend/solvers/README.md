# Solvers

This folder is for topic-specific challenge solvers. The project started with RSA logic in `backend/crypto_utils.py`; new work should be split into modules here so multiple teammates can work without editing the same large file.

## Intended Structure

```text
backend/solvers/
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

## Topic Ownership Map

| Board topic | File to create/edit | Status |
| --- | --- | --- |
| RSA Shared Prime Attack | `backend/crypto_utils.py`, later `crypto/rsa.py` | Implemented |
| RSA Cracking | `backend/crypto_utils.py`, later `crypto/rsa.py` | Partial |
| Wiener's Attack On RSA | `crypto/rsa.py` | Planned |
| Affine Cipher | `crypto/classical.py` | Planned |
| Permutation Cipher | `crypto/classical.py` | Planned |
| Frequency Analysis | `crypto/frequency.py` | Planned |
| Vigenere Cipher | `crypto/vigenere.py` | Planned |
| Custom Vigenere | `crypto/vigenere.py` | Planned |
| Hill Cipher | `crypto/hill.py` | Planned |
| 4 Layer Mutation Cypher | `crypto/mutation.py` | Planned |
| One Time Pad Key Reuse | `crypto/otp.py` | Planned |
| DES Cracking | `crypto/des.py` | Planned |
| Meet In The Middle On Double Encryption | `crypto/mitm.py` | Planned |
| DES Meet In The Middle | `crypto/mitm.py` | Planned |
| Break The Hash | `crypto/hashes.py` | Planned |
| ECDSA And Blockchain | `crypto/ecdsa.py` | Planned |
| Password Protected ZIP File | `files/zip_solver.py` | Planned |
| LUKS Encryption | `files/luks.py` | Planned |
| Binary Data Preview | `backend/file_parser.py` | Partial |

## How To Add A Solver

1. Create or edit the file listed above for your topic.
2. Add one clear entry function, such as:

```python
def solve_vigenere(challenge_text: str) -> dict:
    ...
```

3. Return the standard solver response:

```python
{
    "category": "crypto",
    "status": "solved",
    "flag": "flag{...}",
    "steps": [],
    "hints": [],
    "artifacts": {},
}
```

4. Wire the function into `backend/routes/solve.py`.
5. Add a working copy-paste example to the root `README.md`.
6. Update `frontend/src/pages/Explore.jsx` from `Planned` to `Partial` or `Implemented`.

## Status Rules

Use these labels consistently:

```text
Implemented  The solver handles a realistic full challenge and returns the expected flag.
Partial      Supporting logic exists, but not enough for a full challenge.
Planned      The topic is listed, but backend logic is not written yet.
```


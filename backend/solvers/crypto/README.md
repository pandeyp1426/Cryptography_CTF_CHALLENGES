# Crypto Solvers

Put cryptography challenge solvers in this folder.

## Topics For This Folder

```text
rsa.py         RSA shared prime, RSA cracking, Wiener's attack
classical.py   Affine cipher and permutation cipher
frequency.py   Frequency analysis for substitution-style ciphers
vigenere.py    Vigenere and custom Vigenere
hill.py        Hill cipher matrix solving
mutation.py    4 layer mutation cypher pipelines
otp.py         One time pad key reuse and crib dragging
des.py         DES cracking helpers
mitm.py        Meet-in-the-middle attacks
hashes.py      Hash identification and cracking
ecdsa.py       ECDSA nonce reuse and blockchain signature issues
```

## Current State

The working RSA implementation still lives in:

```text
backend/crypto_utils.py
```

When the RSA code gets larger, move it into:

```text
backend/solvers/crypto/rsa.py
```

and keep `backend/crypto_utils.py` for shared math helpers such as:

```text
gcd
mod_inverse
integer_nth_root
int_to_bytes
find_flags
```

## Solver Checklist

For each solver:

- parse challenge text robustly,
- return clear step-by-step output,
- include hints when not solved,
- include useful artifacts such as plaintext, key, ciphertext, or intermediate values,
- do not hard-code one challenge answer,
- add a working example to the root `README.md`.


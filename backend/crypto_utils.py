from __future__ import annotations

import base64
import math
import re
from dataclasses import dataclass
from typing import Any


FLAG_PATTERN = re.compile(
    r"(?i)\b(?:flag|ctf|picoCTF|crypto|ictf|uiuctf|csawctf)\{[^}\r\n]{1,200}\}"
)
ASSIGNMENT_PATTERN = re.compile(
    r"(?im)\b(?P<name>n\d*|e|d|p|q|phi|totient|c|ct|cipher|ciphertext|m|msg|message)\b"
    r"\s*(?:=|:)\s*(?P<value>0x[0-9a-f]+|\d+|[A-Za-z0-9+/=_-]{16,})"
)


@dataclass(slots=True)
class SolveStep:
    title: str
    body: str
    code: str | None = None
    kind: str = "analysis"

    def as_dict(self) -> dict[str, str | None]:
        return {
            "title": self.title,
            "body": self.body,
            "code": self.code,
            "kind": self.kind,
        }


def gcd(a: int, b: int) -> int:
    return math.gcd(a, b)


def egcd(a: int, b: int) -> tuple[int, int, int]:
    if b == 0:
        return (a, 1, 0)
    g, x1, y1 = egcd(b, a % b)
    return (g, y1, x1 - (a // b) * y1)


def mod_inverse(a: int, m: int) -> int:
    g, x, _ = egcd(a, m)
    if g != 1:
        raise ValueError(f"{a} has no inverse modulo {m}")
    return x % m


def int_to_bytes(value: int) -> bytes:
    if value == 0:
        return b"\x00"
    return value.to_bytes((value.bit_length() + 7) // 8, "big")


def decode_plaintext(value: int) -> tuple[bytes, str]:
    raw = int_to_bytes(value)
    text = raw.decode("utf-8", errors="replace")
    return raw, text


def find_flags(text: str) -> list[str]:
    seen: set[str] = set()
    flags: list[str] = []
    for match in FLAG_PATTERN.finditer(text):
        flag = match.group(0)
        payload = flag[flag.find("{") + 1 : -1].strip().lower()
        if payload in {"plaintext", "answer", "your_answer", "your-flag", "your_flag", "..."}:
            continue
        if flag not in seen:
            seen.add(flag)
            flags.append(flag)
    return flags


def parse_int_token(value: str) -> int | None:
    cleaned = value.strip().strip(",.;")
    if cleaned.lower().startswith("0x"):
        return int(cleaned, 16)
    if cleaned.isdigit():
        return int(cleaned, 10)
    decoded = _decode_text_token(cleaned)
    if decoded:
        as_int = int.from_bytes(decoded, "big")
        return as_int if as_int else None
    return None


def parse_assignments(text: str) -> dict[str, int]:
    values: dict[str, int] = {}
    aliases = {
        "ct": "c",
        "cipher": "c",
        "ciphertext": "c",
        "totient": "phi",
        "msg": "m",
        "message": "m",
    }
    for match in ASSIGNMENT_PATTERN.finditer(text):
        name = aliases.get(match.group("name").lower(), match.group("name").lower())
        parsed = parse_int_token(match.group("value"))
        if parsed is not None:
            values[name] = parsed
    return values


def solve_rsa_challenge(challenge_text: str) -> dict[str, Any]:
    steps: list[SolveStep] = []
    hints: list[str] = []
    flags = find_flags(challenge_text)
    values = parse_assignments(challenge_text)

    if flags:
        steps.append(
            SolveStep(
                "Flag found in input",
                "The submitted text already contains a flag-shaped token.",
                "\n".join(flags),
                "flag",
            )
        )
        return _result("crypto", steps, hints, flags[0], values)

    if values:
        parsed_lines = [f"{name} = {value}" for name, value in sorted(values.items())]
        steps.append(
            SolveStep(
                "Parsed RSA parameters",
                f"Found {len(values)} numeric value(s) that look like RSA inputs.",
                "\n".join(parsed_lines),
            )
        )
    else:
        hints.extend(
            [
                "Paste RSA parameters in a simple form such as n = ..., e = ..., c = ...",
                "If the challenge is a PDF, install pypdf or pdfminer.six so uploaded PDFs can be parsed more reliably.",
            ]
        )
        steps.append(
            SolveStep(
                "No parameters parsed",
                "I could not find RSA-style assignments in the input.",
                None,
                "warning",
            )
        )
        return _result("crypto", steps, hints, None, values)

    plaintext = _try_direct_plaintext(values, steps)
    if plaintext:
        decoded_text = plaintext.decode("utf-8", errors="replace")
        found = find_flags(decoded_text)
        derived_flag = found[0] if found else _derive_flag_from_prompt(
            challenge_text,
            values.get("m"),
            decoded_text,
            steps,
        )
        hints.append("Verify padding and encoding if the decoded bytes contain replacement characters.")
        return _result("crypto", steps, hints, derived_flag, values, plaintext)

    decrypted = _try_private_key_decrypt(values, steps, hints)
    if decrypted is not None:
        values["m"] = decrypted
        raw, decoded_text = decode_plaintext(decrypted)
        steps.append(
            SolveStep(
                "Decoded plaintext",
                "Converted the decrypted integer into big-endian bytes and UTF-8 text.",
                f"m = {decrypted}\ntext = {decoded_text}",
                "success",
            )
        )
        found = find_flags(decoded_text)
        derived_flag = found[0] if found else _derive_flag_from_prompt(
            challenge_text,
            decrypted,
            decoded_text,
            steps,
        )
        hints.append("If the output is not readable, inspect the bytes in hex or try removing RSA padding.")
        return _result("crypto", steps, hints, derived_flag, values, raw)

    low_exponent = _try_low_exponent(values, steps)
    if low_exponent is not None:
        values["m"] = low_exponent
        raw, decoded_text = decode_plaintext(low_exponent)
        steps.append(
            SolveStep(
                "Decoded plaintext",
                "Recovered an exact integer root and decoded it as bytes.",
                f"m = {low_exponent}\ntext = {decoded_text}",
                "success",
            )
        )
        found = find_flags(decoded_text)
        derived_flag = found[0] if found else _derive_flag_from_prompt(
            challenge_text,
            low_exponent,
            decoded_text,
            steps,
        )
        return _result("crypto", steps, hints, derived_flag, values, raw)

    _add_rsa_hints(values, hints)
    steps.append(
        SolveStep(
            "Manual work needed",
            "The parser found RSA parameters, but the challenge did not match the implemented quick attacks.",
            None,
            "warning",
        )
    )
    return _result("crypto", steps, hints, None, values)


def _try_private_key_decrypt(
    values: dict[str, int],
    steps: list[SolveStep],
    hints: list[str],
) -> int | None:
    c = values.get("c")
    e = values.get("e")
    d = values.get("d")
    n = values.get("n") or values.get("n1")
    p = values.get("p")
    q = values.get("q")
    phi = values.get("phi")

    if c is None:
        hints.append("A ciphertext value named c, ct, cipher, or ciphertext is required for decryption.")
        return None

    if d is not None and n is not None:
        steps.append(
            SolveStep(
                "Used private exponent",
                "A private exponent d was provided, so plaintext is m = c^d mod n.",
                f"m = pow(c, d, n)",
            )
        )
        return pow(c, d, n)

    if e is None:
        return None

    shared = _try_shared_prime_attack(values, steps)
    if shared is not None:
        n, p, q, phi = shared
        values["n"] = n
        values["p"] = p
        values["q"] = q
        values["phi"] = phi

    if phi is None and p is not None and q is not None:
        phi = (p - 1) * (q - 1)
        n = n or p * q
        values.setdefault("n", n)
        values["phi"] = phi
        steps.append(
            SolveStep(
                "Computed totient",
                "Both primes were provided, so phi(n) = (p - 1)(q - 1).",
                f"n = p * q = {n}\nphi = {phi}",
            )
        )

    if phi is None and n is not None:
        factors = factor_semiprime(n)
        if factors:
            p, q = factors
            phi = (p - 1) * (q - 1)
            values["p"] = p
            values["q"] = q
            values["phi"] = phi
            steps.append(
                SolveStep(
                    "Factored modulus",
                    "The modulus was small enough for built-in trial division.",
                    f"p = {p}\nq = {q}\nphi = {phi}",
                )
            )

    if phi is None or n is None:
        return None

    try:
        d = mod_inverse(e, phi)
    except ValueError as exc:
        steps.append(SolveStep("Private exponent failed", str(exc), None, "warning"))
        return None

    values["d"] = d
    steps.append(
        SolveStep(
            "Computed private exponent",
            "Because gcd(e, phi) = 1, d is the modular inverse of e modulo phi.",
            f"d = inverse(e, phi) = {d}\nm = pow(c, d, n)",
        )
    )
    return pow(c, d, n)


def _try_shared_prime_attack(
    values: dict[str, int],
    steps: list[SolveStep],
) -> tuple[int, int, int, int] | None:
    numbered_moduli = sorted(
        (key, value)
        for key, value in values.items()
        if re.fullmatch(r"n\d+", key) and value > 1
    )
    if len(numbered_moduli) < 2:
        return None

    for index, (left_key, left_n) in enumerate(numbered_moduli):
        for right_key, right_n in numbered_moduli[index + 1 :]:
            shared = gcd(left_n, right_n)
            if shared <= 1 or shared == left_n or shared == right_n:
                continue

            primary_key = "n1" if "n1" in values else left_key
            primary_n = values[primary_key]
            if primary_n % shared != 0:
                primary_key = left_key
                primary_n = left_n

            p = shared
            q = primary_n // shared
            phi = (p - 1) * (q - 1)
            steps.append(
                SolveStep(
                    "Shared prime factor",
                    f"Computed gcd({left_key}, {right_key}) and found a reused RSA prime.",
                    f"gcd({left_n}, {right_n}) = {shared}\n{primary_key} = {primary_n} = {p} * {q}\nphi = {phi}",
                    "success",
                )
            )
            return primary_n, p, q, phi

    return None


def _derive_flag_from_prompt(
    challenge_text: str,
    plaintext_value: int | None,
    decoded_text: str,
    steps: list[SolveStep],
) -> str | None:
    if plaintext_value is None:
        return None

    asks_for_flag_format = re.search(
        r"(?is)(submit|answer|format).{0,80}flag\s*\{|\bflag\s*\{\s*plaintext\s*\}",
        challenge_text,
    )
    if not asks_for_flag_format:
        return None

    printable_text = decoded_text.strip()
    if printable_text and "\ufffd" not in printable_text and printable_text.isprintable():
        payload = printable_text
    else:
        payload = str(plaintext_value)

    flag = f"flag{{{payload}}}"
    steps.append(
        SolveStep(
            "Applied flag format",
            "The prompt asks for flag{plaintext}, so the recovered plaintext was wrapped in that format.",
            flag,
            "flag",
        )
    )
    return flag


def _try_direct_plaintext(values: dict[str, int], steps: list[SolveStep]) -> bytes | None:
    m = values.get("m")
    if m is None:
        return None
    raw, decoded = decode_plaintext(m)
    steps.append(
        SolveStep(
            "Decoded message integer",
            "A message integer was provided directly, so it was converted to bytes.",
            decoded,
            "success",
        )
    )
    return raw


def _try_low_exponent(values: dict[str, int], steps: list[SolveStep]) -> int | None:
    c = values.get("c")
    e = values.get("e")
    n = values.get("n")
    if c is None or e is None or e > 17:
        return None

    root, exact = integer_nth_root(c, e)
    if exact and (n is None or root < n):
        steps.append(
            SolveStep(
                "Low exponent shortcut",
                "The ciphertext is an exact e-th power, so no modular reduction happened.",
                f"m = integer_nth_root(c, {e}) = {root}",
            )
        )
        return root
    return None


def factor_semiprime(n: int, max_divisor: int = 2_000_000) -> tuple[int, int] | None:
    if n % 2 == 0:
        return 2, n // 2
    limit = min(math.isqrt(n), max_divisor)
    divisor = 3
    while divisor <= limit:
        if n % divisor == 0:
            return divisor, n // divisor
        divisor += 2
    return None


def integer_nth_root(value: int, n: int) -> tuple[int, bool]:
    if value < 0:
        raise ValueError("integer_nth_root only supports non-negative values")
    if value in (0, 1):
        return value, True

    low = 0
    high = 1 << ((value.bit_length() + n - 1) // n)
    while low <= high:
        mid = (low + high) // 2
        powered = mid**n
        if powered == value:
            return mid, True
        if powered < value:
            low = mid + 1
        else:
            high = mid - 1
    return high, False


def _decode_text_token(token: str) -> bytes | None:
    try:
        if re.fullmatch(r"[0-9a-fA-F]+", token) and len(token) % 2 == 0:
            return bytes.fromhex(token)
    except ValueError:
        pass

    candidates = [token]
    if "-" in token or "_" in token:
        candidates.append(token.replace("-", "+").replace("_", "/"))

    for candidate in candidates:
        padded = candidate + "=" * (-len(candidate) % 4)
        try:
            decoded = base64.b64decode(padded, validate=True)
        except Exception:
            continue
        if decoded:
            return decoded
    return None


def _add_rsa_hints(values: dict[str, int], hints: list[str]) -> None:
    n = values.get("n")
    e = values.get("e")
    if n and n.bit_length() < 128:
        hints.append("The modulus is very small. Factoring with a tool such as sympy.factorint should finish quickly.")
    if e in {3, 5, 17}:
        hints.append("Small e is often paired with low-exponent, broadcast, or padding mistakes.")
    if "p" not in values and "q" not in values:
        hints.append("Look for leaked primes, shared factors across multiple moduli, or a weak random generator.")
    if "c" in values:
        hints.append("Try representing the decrypted integer as bytes, hex, and text; flags are often padded or encoded.")


def _result(
    category: str,
    steps: list[SolveStep],
    hints: list[str],
    flag: str | None,
    values: dict[str, int],
    plaintext: bytes | None = None,
) -> dict[str, Any]:
    artifacts: dict[str, Any] = {
        "parameters": {key: str(value) for key, value in values.items()},
    }
    if plaintext is not None:
        text_preview = plaintext.decode("utf-8", errors="replace")
        artifacts["plaintextHex"] = plaintext.hex()
        artifacts["plaintextText"] = text_preview
        artifacts["plaintextPreview"] = _readable_preview(text_preview, values.get("m"))
    return {
        "category": category,
        "status": "solved" if flag else "needs-review",
        "flag": flag,
        "steps": [step.as_dict() for step in steps],
        "hints": hints,
        "artifacts": artifacts,
    }


def _readable_preview(text: str, numeric_plaintext: int | None) -> str:
    stripped = text.strip()
    if stripped and "\ufffd" not in stripped and all(char.isprintable() or char.isspace() for char in stripped):
        return stripped
    if numeric_plaintext is not None:
        return str(numeric_plaintext)
    return text

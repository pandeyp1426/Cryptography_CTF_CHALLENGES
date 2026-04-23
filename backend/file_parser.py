from __future__ import annotations

import io
import re
from dataclasses import dataclass

from fastapi import UploadFile


@dataclass(slots=True)
class ParsedFile:
    filename: str
    content_type: str
    size: int
    text: str
    notes: list[str]


async def parse_upload(file: UploadFile | None) -> ParsedFile | None:
    if file is None:
        return None

    data = await file.read()
    content_type = file.content_type or "application/octet-stream"
    suffix = (file.filename or "").lower().rsplit(".", 1)[-1]

    if suffix == "pdf" or content_type == "application/pdf":
        text, notes = parse_pdf(data)
    elif content_type.startswith("text/") or suffix in {"txt", "py", "md", "json", "csv"}:
        text = data.decode("utf-8", errors="replace")
        notes = []
    else:
        text = parse_binary_preview(data)
        notes = ["Binary preview only. Use a dedicated parser for images, captures, or packed files."]

    return ParsedFile(
        filename=file.filename or "upload",
        content_type=content_type,
        size=len(data),
        text=text,
        notes=notes,
    )


def parse_pdf(data: bytes) -> tuple[str, list[str]]:
    notes: list[str] = []
    try:
        from pypdf import PdfReader
    except Exception:
        PdfReader = None

    if PdfReader is not None:
        try:
            reader = PdfReader(io.BytesIO(data))
            pages = [page.extract_text() or "" for page in reader.pages]
            text = "\n".join(page.strip() for page in pages if page.strip())
            if text:
                return text, notes
        except Exception as exc:
            notes.append(f"pypdf failed: {exc}")

    fallback = _raw_pdf_text_fallback(data)
    if fallback:
        notes.append("Used raw PDF text fallback. Install pypdf for better extraction.")
        return fallback, notes

    notes.append("PDF text could not be extracted. Install pypdf or pdfminer.six.")
    return "", notes


def parse_binary_preview(data: bytes, limit: int = 4096) -> str:
    preview = data[:limit]
    hex_lines = []
    for offset in range(0, len(preview), 16):
        chunk = preview[offset : offset + 16]
        hex_part = " ".join(f"{byte:02x}" for byte in chunk)
        ascii_part = "".join(chr(byte) if 32 <= byte <= 126 else "." for byte in chunk)
        hex_lines.append(f"{offset:08x}  {hex_part:<47}  {ascii_part}")
    return "\n".join(hex_lines)


def _raw_pdf_text_fallback(data: bytes) -> str:
    decoded = data.decode("latin-1", errors="ignore")
    chunks = re.findall(r"\(([^()]{3,500})\)", decoded)
    cleaned = []
    for chunk in chunks:
        chunk = chunk.replace(r"\(", "(").replace(r"\)", ")")
        chunk = chunk.replace(r"\n", "\n").replace(r"\r", "\n").replace(r"\t", "\t")
        if any(char.isalnum() for char in chunk):
            cleaned.append(chunk)
    return "\n".join(cleaned)


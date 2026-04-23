from __future__ import annotations

import asyncio
import json
from typing import Any, AsyncIterator

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse

from backend.crypto_utils import find_flags, solve_rsa_challenge
from backend.db.database import create_history_entry
from backend.file_parser import parse_upload


router = APIRouter(tags=["solve"])


@router.post("/solve")
async def solve(
    challenge: str = Form(default=""),
    category: str = Form(default="crypto"),
    save: bool = Form(default=True),
    file: UploadFile | None = File(default=None),
) -> StreamingResponse:
    parsed_file = await parse_upload(file)
    combined_text = _combine_inputs(challenge, parsed_file.text if parsed_file else "")
    normalized_category = category.lower().strip() or "crypto"

    async def event_stream() -> AsyncIterator[str]:
        yield _event("status", {"message": "Input received"})
        await asyncio.sleep(0)

        if parsed_file:
            yield _event(
                "file",
                {
                    "filename": parsed_file.filename,
                    "contentType": parsed_file.content_type,
                    "size": parsed_file.size,
                    "notes": parsed_file.notes,
                },
            )
            await asyncio.sleep(0)

        result = _solve_by_category(normalized_category, combined_text)
        for step in result["steps"]:
            yield _event("step", step)
            await asyncio.sleep(0)

        history_record = None
        if save:
            title = _title_for_history(combined_text, parsed_file.filename if parsed_file else None)
            history_record = create_history_entry(
                title=title,
                category=normalized_category,
                challenge=combined_text[:200_000],
                result=result,
                flag=result.get("flag"),
            )
            yield _event("history", {"id": history_record["id"]})
            await asyncio.sleep(0)

        yield _event("complete", {"result": result, "history": history_record})

    return StreamingResponse(event_stream(), media_type="application/x-ndjson")


def _solve_by_category(category: str, text: str) -> dict[str, Any]:
    if category == "crypto":
        return solve_rsa_challenge(text)

    flags = find_flags(text)
    return {
        "category": category,
        "status": "solved" if flags else "needs-review",
        "flag": flags[0] if flags else None,
        "steps": [
            {
                "title": "Generic triage",
                "body": f"Stored a {category} challenge and scanned for flag-shaped tokens.",
                "code": flags[0] if flags else None,
                "kind": "analysis",
            }
        ],
        "hints": [
            "Add a category-specific solver module for deeper automation.",
            "Keep notes, artifacts, and commands in the writeup so the history remains useful.",
        ],
        "artifacts": {},
    }


def _combine_inputs(challenge: str, parsed_text: str) -> str:
    parts = [part.strip() for part in (challenge, parsed_text) if part and part.strip()]
    return "\n\n".join(parts)


def _title_for_history(text: str, filename: str | None) -> str:
    if filename:
        return filename
    first_line = next((line.strip() for line in text.splitlines() if line.strip()), "")
    return first_line[:120] or "Untitled challenge"


def _event(event: str, payload: dict[str, Any]) -> str:
    return json.dumps({"event": event, **payload}, default=str) + "\n"


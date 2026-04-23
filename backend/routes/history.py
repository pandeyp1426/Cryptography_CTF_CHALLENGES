from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from backend.db.database import create_history_entry, get_history_entry, list_history_entries


router = APIRouter(prefix="/history", tags=["history"])


class HistoryCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=32)
    challenge: str = Field(default="", max_length=200_000)
    result: dict = Field(default_factory=dict)
    flag: str | None = None


@router.get("")
def list_history(limit: int = Query(default=50, ge=1, le=200)) -> dict[str, list[dict]]:
    return {"items": list_history_entries(limit)}


@router.get("/{record_id}")
def get_history(record_id: int) -> dict:
    try:
        return get_history_entry(record_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("", status_code=201)
def create_history(payload: HistoryCreate) -> dict:
    return create_history_entry(
        title=payload.title,
        category=payload.category,
        challenge=payload.challenge,
        result=payload.result,
        flag=payload.flag,
    )


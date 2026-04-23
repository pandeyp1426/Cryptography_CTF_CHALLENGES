from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(slots=True)
class SolveRecord:
    id: int
    title: str
    category: str
    challenge: str
    result: dict[str, Any]
    flag: str | None
    created_at: datetime


import json
import os
import sqlite3
from pathlib import Path
from typing import Any


DEFAULT_DB_PATH = Path(__file__).resolve().parents[1] / "ctf_solver.sqlite3"
DB_PATH = Path(os.getenv("CTF_SOLVER_DB", DEFAULT_DB_PATH))


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS solve_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                challenge TEXT NOT NULL,
                result_json TEXT NOT NULL,
                flag TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


def create_history_entry(
    *,
    title: str,
    category: str,
    challenge: str,
    result: dict[str, Any],
    flag: str | None,
) -> dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO solve_history (title, category, challenge, result_json, flag)
            VALUES (?, ?, ?, ?, ?)
            """,
            (title, category, challenge, json.dumps(result), flag),
        )
        conn.commit()
        return get_history_entry(cursor.lastrowid)


def get_history_entry(record_id: int) -> dict[str, Any]:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM solve_history WHERE id = ?",
            (record_id,),
        ).fetchone()
    if row is None:
        raise KeyError(f"History record {record_id} was not found")
    return _row_to_dict(row)


def list_history_entries(limit: int = 50) -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT * FROM solve_history
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [_row_to_dict(row) for row in rows]


def _row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    result = json.loads(row["result_json"])
    return {
        "id": row["id"],
        "title": row["title"],
        "category": row["category"],
        "challenge": row["challenge"],
        "result": result,
        "flag": row["flag"],
        "createdAt": row["created_at"],
    }


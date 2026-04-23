from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from pathlib import Path


class ExecutionError(RuntimeError):
    pass


def run_python_snippet(code: str, timeout_seconds: int = 3) -> dict[str, str | int]:
    if timeout_seconds < 1 or timeout_seconds > 10:
        raise ValueError("timeout_seconds must be between 1 and 10")

    with tempfile.TemporaryDirectory(prefix="ctf-solver-") as tmpdir:
        script = Path(tmpdir) / "snippet.py"
        script.write_text(code, encoding="utf-8")
        env = {
            "PYTHONIOENCODING": "utf-8",
            "PYTHONDONTWRITEBYTECODE": "1",
            "PATH": os.environ.get("PATH", ""),
        }
        try:
            completed = subprocess.run(
                [sys.executable, str(script)],
                cwd=tmpdir,
                env=env,
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                shell=False,
            )
        except subprocess.TimeoutExpired as exc:
            raise ExecutionError("Python snippet timed out") from exc

    return {
        "returnCode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }


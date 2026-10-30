import sqlite3
from pathlib import Path
from datetime import datetime, timezone

DB_PATH = Path(__file__).parent / "haseen.db"

def init_db():
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS incident_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT NOT NULL,
                scan_time TEXT NOT NULL,
                status TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                defacement_detected INTEGER NOT NULL
            )
        """)
        connection.commit()
    


def log_incident(
    file_name: str,
    status: str,
    risk_level: str,
    risk_score: int,
    defacement_detected: bool
):
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            INSERT INTO incident_logs
            (file_name, scan_time, status, risk_level, risk_score, defacement_detected)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                file_name,
                datetime.now(timezone.utc).isoformat(),
                status,
                risk_level,
                risk_score,
                int(defacement_detected)
            )
        )
        connection.commit()

def get_incidents():
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row

        rows = connection.execute(
            """
            SELECT *
            FROM incident_logs
            ORDER BY id DESC
            """
        ).fetchall()

    return [dict(row) for row in rows]
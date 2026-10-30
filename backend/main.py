from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import os
import tempfile
import shutil
from database import init_db, log_incident, get_incidents


app = FastAPI(
    title="HASEEN Security Engine",
    description="Website integrity and defacement detection engine",
    version="1.0.0",
   
)
init_db()  
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASELINE_DIR = os.path.join(os.path.dirname(__file__), "baseline")

os.makedirs(BASELINE_DIR, exist_ok=True)


def calculate_sha256(file_path: str) -> str:
    """Calculate SHA-256 hash for a file."""

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while chunk := file.read(8192):
            sha256.update(chunk)

    return sha256.hexdigest()

def detect_defacement(file_path: str) -> dict:
    """Detect common defacement indicators in HTML content."""

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
            content = file.read().lower()
    except Exception:
        return {
            "detected": False,
            "indicators": [],
        }

    indicators = []

    defacement_keywords = [
        "hacked by",
        "owned by",
        "defaced by",
        "you have been hacked",
        "site hacked",
        "website hacked",
        "pwned",
        "hacker",
        "anonymous",
    ]

    for keyword in defacement_keywords:
        if keyword in content:
            indicators.append(f"Defacement keyword detected: {keyword}")

    if "<script" in content and (
        "document.cookie" in content
        or "localstorage" in content
        or "sessionstorage" in content
    ):
        indicators.append("Potential script injection detected")

    return {
        "detected": len(indicators) > 0,
        "indicators": indicators,
    }
def calculate_risk_score(defacement_result: dict) -> int:
    score = 0

    for indicator in defacement_result["indicators"]:
        indicator_lower = indicator.lower()

        if "script injection" in indicator_lower:
            score += 60
        elif "defacement keyword" in indicator_lower:
            score += 40

    return min(score, 100)
def analyze_file(file_path: str) -> dict:
    """Analyze a website file."""

    file_name = os.path.basename(file_path)
    file_hash = calculate_sha256(file_path)

    return {
        "file": file_name,
        "sha256": file_hash,
        "status": "analyzed",
    }


@app.get("/")
def root():
    return {
        "system": "HASEEN Security Engine",
        "status": "online",
        "version": "1.0.0",
    }
@app.get("/incidents")
def read_incidents():
    return {
        "success": True,
        "incidents": get_incidents(),
    }

@app.post("/baseline")
async def create_baseline(file: UploadFile = File(...)):
    """
    Store a trusted copy of a website file.
    """

    file_name = os.path.basename(file.filename or "unknown_file")
    baseline_path = os.path.join(BASELINE_DIR, file_name)

    with open(baseline_path, "wb") as output:
        content = await file.read()
        output.write(content)

    file_hash = calculate_sha256(baseline_path)

    return {
        "success": True,
        "message": "Baseline created successfully",
        "file": file_name,
        "sha256": file_hash,
        "status": "TRUSTED",
    }


@app.post("/compare")
async def compare_file(file: UploadFile = File(...)):
    """
    Compare an uploaded file with its trusted baseline.
    """

    file_name = os.path.basename(file.filename or "unknown_file")
    baseline_path = os.path.join(BASELINE_DIR, file_name)

    if not os.path.exists(baseline_path):
        return {
            "success": False,
            "message": "No baseline exists for this file",
            "file": file_name,
            "status": "NO_BASELINE",
        }

    with tempfile.NamedTemporaryFile(delete=False) as temp:
        content = await file.read()
        temp.write(content)
        temp_path = temp.name

    try:
        baseline_hash = calculate_sha256(baseline_path)
        current_hash = calculate_sha256(temp_path)
        defacement_result = detect_defacement(temp_path)
        risk_score = calculate_risk_score(defacement_result)

        if baseline_hash == current_hash:
            log_incident(
                file_name,
                "UNCHANGED",
                "LOW",
                0,
                defacement_result["detected"],
            )

            return {
                "success": True,
                "file": file_name,
                "status": "UNCHANGED",
                "risk": "LOW",
                "baseline_sha256": baseline_hash,
                "current_sha256": current_hash,
                "message": "No modification detected",
            }

        if any(
            "script injection" in indicator.lower()
            for indicator in defacement_result["indicators"]
        ):
            risk_level = "CRITICAL"
        elif defacement_result["detected"]:
            risk_level = "HIGH"
        else:
            risk_level = "MEDIUM"

        log_incident(
            file_name,
            "MODIFIED",
            risk_level,
            risk_score,
            defacement_result["detected"],
        )

        return {
            "success": True,
            "file": file_name,
            "status": "MODIFIED",
            "risk": risk_level,
            "risk_score": risk_score,
            "defacement_detected": defacement_result["detected"],
            "baseline_sha256": baseline_hash,
            "current_sha256": current_hash,
            "message": "File modification detected",
        }

    finally:
        os.remove(temp_path)
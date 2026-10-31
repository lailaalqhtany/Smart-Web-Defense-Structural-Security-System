HASEEN | حصين

Smart Web Defense & Structural Security System

HASEEN is a web security platform designed to monitor website integrity, identify suspicious file modifications, detect common defacement indicators, and maintain an incident history.

The platform combines a bilingual security dashboard with a Python-based backend for file integrity verification and security analysis.

Key Features

Security Dashboard

Overall security status and threat overview.
Website integrity monitoring.
Detection indicators for structural tampering, defacement, and potential script injection.
Security event and incident visibility.
Arabic and English interface with RTL support.
File Integrity Monitoring

Create a trusted baseline for website files.
Calculate SHA-256 cryptographic hashes.
Compare uploaded files against their trusted baseline.
Identify unchanged and modified files.
Return structured analysis results.
Defacement Detection

Inspect HTML content for common defacement indicators.
Identify suspicious keywords and potential script injection patterns.
Calculate a risk score based on detected indicators.
Classify findings by risk level.
Incident Logging

Store security scan records using SQLite.
Record file names, timestamps, scan status, risk levels, and detection results.
Retrieve previous incident records through the backend API.
Security Reports

Present security findings and forensic information through the dashboard.
Provide visibility into file integrity and detected indicators.
Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui |
| Backend | Python, FastAPI |
| File Integrity | SHA-256 |
| Detection | Rule-based and keyword analysis |
| Database | SQLite |
| API Documentation | Swagger UI |
| Version Control | Git & GitHub |

System Architecture

                HASEEN Platform
                      |
          +-----------+-----------+
          |                       |
     Frontend                 Backend API
  React + TypeScript             FastAPI
          |                       |
   Security Dashboard      +------+------+
   Bilingual Interface     |             |
   Security Reports    File Analysis  Incident Logging
                          |             |
                     SHA-256       SQLite Database
                     Detection
                     Risk Scoring
Backend API

Run the backend locally and access the interactive API documentation at:

http://127.0.0.1:8000/docs

Method Endpoint Description GET / Check security engine status POST /baseline Create a trusted file baseline POST /compare Compare a file against its baseline GET /incidents Retrieve incident history

Installation & Setup

Clone the Repository
git clone https://github.com/lailaalqhtany/HASEEN-Smart-Web-Defense.git cd HASEEN-Smart-Web-Defense

Set Up the Frontend
npm install npm run dev

Set Up the Backend
Open a terminal in the backend directory:

cd backend

Install the required Python packages:

pip install fastapi uvicorn python-multipart

Start the API server:

uvicorn main:app --reload

The backend will be available at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

Project Structure

HASEEN/ ├── backend/ │ ├── main.py │ ├── database.py │ └── baseline/ ├── public/ ├── src/ ├── .gitignore ├── package.json └── README.md

Security Notes

SHA-256 is used to verify file integrity.
Baseline files are stored locally by the backend.
Incident records are maintained in an SQLite database.
Defacement detection currently uses rule-based indicators and should not be treated as a complete malware or web application security scanner.
Production deployment requires additional controls, including authentication, access restrictions, secure file handling, and hardened CORS configuration.
Project Goals

HASEEN aims to provide a centralized approach to website integrity monitoring, suspicious modification detection, and security incident tracking.

⸻

Developed as a Cybersecurity Project

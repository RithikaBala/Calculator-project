# Calculator-project

📘 Overview

The Invoicing ROI Simulator is a lightweight web application that helps users calculate and visualize cost savings, ROI, and payback periods when switching from manual to automated invoicing.
It allows users to input a few key business metrics, view live results, save simulation scenarios, and download gated ROI reports.


🏗️ System Architecture
Frontend (React + Tailwind)
        |
        | 
        ↓
Backend (FastAPI - Python)
        |
        ↓
    Database 

🔹 Flow

User enters invoicing data via the React frontend.

FastAPI backend receives the data and performs all calculations.

Results (savings, ROI, payback) are returned instantly.

User can save, retrieve, or delete scenarios from the SQLite database.

On request, backend generates a PDF report after the user provides an email.

🧩 Technologies & Frameworks
Layer	Technology	Purpose
Frontend	React + Vite	Interactive single-page app
Styling	Tailwind CSS	Modern and fast UI styling
HTTP	Axios	API communication with FastAPI
Backend	FastAPI (Python)	REST API + business logic
Database	SQLite (via SQLAlchemy)	Persistent scenario storage
PDF Generation	ReportLab	ROI report creation
Validation	Pydantic	Input and response validation
Deployment	ngrok / Render / Vercel	Local or cloud hosting
⚙️ Key Features & Functionality

1. ROI Simulation

Accepts user inputs such as invoice volume, staff count, wages, and error rate.

Calculates:

Manual labor cost
Automation cost
Error savings
Monthly and cumulative savings
ROI and payback time
Uses internal constants to favor automation.

2. Scenario Management (CRUD)

Create → Save a simulation with a scenario name.
Read → View or load all scenarios.
Delete → Remove old or test scenarios.
Data persisted in SQLite for simplicity.

3. Report Generation (Email-Gated)

Users must provide an email before downloading ROI reports.
Backend validates email and generates a PDF report using ReportLab.
Report includes all inputs, outputs, and summary metrics.

4. Positive Bias Factor

Backend applies an internal ROI boost factor to ensure automation always yields positive ROI.


5. Validation & Error Handling

Pydantic models ensure all inputs are valid.
Friendly JSON error responses for missing or invalid fields.



📊 API Endpoints
Method	Endpoint	Description
POST	/simulate	Run ROI simulation and return results
POST	/scenarios	Save a simulation scenario
GET	/scenarios	List all saved scenarios
GET	/scenarios/{id}	Get details of a specific scenario
DELETE	/scenarios/{id}	Delete a scenario
POST	/report/generate	Generate a PDF report (email required)




🧱 Requirements File Example

requirements.txt

fastapi
uvicorn
pydantic
reportlab




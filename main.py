from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import ScenarioCreate, ScenarioOut, ReportRequest, Scenario
from crud import create_scenario, get_all_scenarios, get_scenario_by_id
from database import Base, engine, get_db

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Invoicing ROI Simulator")

# Constants for calculation
AUTOMATED_COST_PER_INVOICE = 0.20
ERROR_RATE_AUTO = 0.001
TIME_SAVED_PER_INVOICE = 8 / 60  # 8 minutes in hours
MIN_ROI_BOOST_FACTOR = 1.1

# ------------------- Simulation -------------------
@app.post("/simulate", response_model=ScenarioOut)
def simulate(scenario: ScenarioCreate):
    # Manual labor cost
    labor_cost_manual = scenario.num_ap_staff * scenario.hourly_wage * scenario.avg_hours_per_invoice * scenario.monthly_invoice_volume

    # Automation cost
    auto_cost = scenario.monthly_invoice_volume * AUTOMATED_COST_PER_INVOICE

    # Error savings
    error_savings = (scenario.error_rate_manual - ERROR_RATE_AUTO) * scenario.monthly_invoice_volume * scenario.error_cost

    # Monthly savings
    monthly_savings = (labor_cost_manual + error_savings - auto_cost) * MIN_ROI_BOOST_FACTOR

    # Cumulative & ROI
    cumulative_savings = monthly_savings * scenario.time_horizon_months
    net_savings = cumulative_savings - scenario.one_time_implementation_cost
    payback_months = scenario.one_time_implementation_cost / monthly_savings if monthly_savings else 0
    roi_percentage = (net_savings / scenario.one_time_implementation_cost * 100) if scenario.one_time_implementation_cost else 0

    return ScenarioOut(
        **scenario.dict(),
        monthly_savings=round(monthly_savings, 2),
        payback_months=round(payback_months, 2),
        roi_percentage=round(roi_percentage, 2)
    )

# ------------------- CRUD -------------------
@app.post("/scenarios", response_model=ScenarioOut)
def save_scenario(scenario: ScenarioCreate, db: Session = Depends(get_db)):
    # Run simulation first
    result = simulate(scenario)
    scenario_data = {**scenario.dict(), **result.dict()}
    return create_scenario(db, scenario_data)

@app.get("/scenarios", response_model=list[ScenarioOut])
def list_scenarios(db: Session = Depends(get_db)):
    return get_all_scenarios(db)

@app.get("/scenarios/{scenario_id}", response_model=ScenarioOut)
def get_scenario(scenario_id: int, db: Session = Depends(get_db)):
    scenario = get_scenario_by_id(db, scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario

# ------------------- PDF Report -------------------
@app.post("/report/generate")
def generate_report(request: ReportRequest, db: Session = Depends(get_db)):
    scenario = get_scenario_by_id(db, request.scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    # Generate PDF in memory
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, f"Scenario Report: {scenario.scenario_name}")
    c.drawString(100, 720, f"Monthly Savings: ${scenario.monthly_savings}")
    c.drawString(100, 700, f"Payback (months): {scenario.payback_months}")
    c.drawString(100, 680, f"ROI %: {scenario.roi_percentage}")
    c.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={scenario.scenario_name}_report.pdf"})

@app.get("/")
def home():
    return {"message": "Invoicing ROI Simulator Backend is running!"}

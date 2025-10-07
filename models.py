from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, Float
from database import Base

# SQLAlchemy model
class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(Integer, primary_key=True, index=True)
    scenario_name = Column(String(255), nullable=False)
    monthly_invoice_volume = Column(Integer)
    num_ap_staff = Column(Integer)
    avg_hours_per_invoice = Column(Float)
    hourly_wage = Column(Float)
    error_rate_manual = Column(Float)
    error_cost = Column(Float)
    time_horizon_months = Column(Integer)
    one_time_implementation_cost = Column(Float, default=0)
    monthly_savings = Column(Float)
    payback_months = Column(Float)
    roi_percentage = Column(Float)

# Pydantic models
class ScenarioCreate(BaseModel):
    scenario_name: str
    monthly_invoice_volume: int
    num_ap_staff: int
    avg_hours_per_invoice: float
    hourly_wage: float
    error_rate_manual: float
    error_cost: float
    time_horizon_months: int
    one_time_implementation_cost: float = 0

class ScenarioOut(ScenarioCreate):
    monthly_savings: float
    payback_months: float
    roi_percentage: float

class ReportRequest(BaseModel):
    email: EmailStr
    scenario_id: int

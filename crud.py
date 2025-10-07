from sqlalchemy.orm import Session
from models import Scenario

# Create a scenario
def create_scenario(db: Session, data: dict):
    scenario = Scenario(**data)
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario

# Get all scenarios
def get_all_scenarios(db: Session):
    return db.query(Scenario).all()

# Get scenario by ID
def get_scenario_by_id(db: Session, scenario_id: int):
    return db.query(Scenario).filter(Scenario.id == scenario_id).first()

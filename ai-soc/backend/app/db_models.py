from sqlalchemy import Column, String, DateTime, Enum as SAEnum
from app.database import Base
from app.models import SeverityLevel, IncidentStatus

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    source = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    severity = Column(SAEnum(SeverityLevel), nullable=False)
    status = Column(SAEnum(IncidentStatus), nullable=False)
    description = Column(String, nullable=True)
    affected_host = Column(String, nullable=True)

from sqlalchemy import Column, Integer, String, ForeignKey, Time, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Horario(Base):
    __tablename__ = "horarios"

    id = Column(Integer, primary_key=True, index=True)
    recurso_id = Column(Integer, ForeignKey("recursos.id"), nullable=False)
    dia = Column(String, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    carrera = Column(String, nullable=True)
    nivel = Column(String, nullable=True)
    activo = Column(Boolean, default=True)

    recurso = relationship("Recurso", backref="horarios")
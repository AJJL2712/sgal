from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Recurso(Base):
    __tablename__ = "recursos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String, nullable=False)  # aula, laboratorio
    ubicacion = Column(String, nullable=False)
    capacidad = Column(Integer, nullable=False)
    estado = Column(String, default="disponible")  # disponible, mantenimiento
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
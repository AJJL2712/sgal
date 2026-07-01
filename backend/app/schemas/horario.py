from pydantic import BaseModel
from typing import Optional
from datetime import time

class HorarioCreate(BaseModel):
    recurso_id: int
    dia: str
    hora_inicio: time
    hora_fin: time
    carrera: Optional[str] = None
    nivel: Optional[str] = None

class HorarioResponse(BaseModel):
    id: int
    recurso_id: int
    dia: str
    hora_inicio: time
    hora_fin: time
    carrera: Optional[str] = None
    nivel: Optional[str] = None
    activo: bool

    class Config:
        from_attributes = True
from pydantic import BaseModel
from typing import Optional

class RecursoCreate(BaseModel):
    nombre: str
    tipo: str
    ubicacion: str
    capacidad: int
    estado: Optional[str] = "disponible"

class RecursoUpdate(BaseModel):
    nombre: Optional[str] = None
    tipo: Optional[str] = None
    ubicacion: Optional[str] = None
    capacidad: Optional[int] = None
    estado: Optional[str] = None
    activo: Optional[bool] = None

class RecursoResponse(BaseModel):
    id: int
    nombre: str
    tipo: str
    ubicacion: str
    capacidad: int
    estado: str
    activo: bool

    class Config:
        from_attributes = True
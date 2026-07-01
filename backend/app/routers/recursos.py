from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.recurso import Recurso
from app.models.horario import Horario
from app.schemas.recurso import RecursoCreate, RecursoUpdate, RecursoResponse
from app.schemas.horario import HorarioCreate, HorarioResponse

router = APIRouter(prefix="/recursos", tags=["Recursos"])

@router.get("/", response_model=List[RecursoResponse])
def listar_recursos(db: Session = Depends(get_db)):
    return db.query(Recurso).filter(Recurso.activo == True).all()

@router.get("/{recurso_id}", response_model=RecursoResponse)
def obtener_recurso(recurso_id: int, db: Session = Depends(get_db)):
    recurso = db.query(Recurso).filter(Recurso.id == recurso_id).first()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
    return recurso

@router.post("/", response_model=RecursoResponse)
def crear_recurso(recurso: RecursoCreate, db: Session = Depends(get_db)):
    nuevo = Recurso(**recurso.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.put("/{recurso_id}", response_model=RecursoResponse)
def actualizar_recurso(recurso_id: int, datos: RecursoUpdate, db: Session = Depends(get_db)):
    recurso = db.query(Recurso).filter(Recurso.id == recurso_id).first()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
    for campo, valor in datos.model_dump(exclude_none=True).items():
        setattr(recurso, campo, valor)
    db.commit()
    db.refresh(recurso)
    return recurso

@router.delete("/{recurso_id}")
def eliminar_recurso(recurso_id: int, db: Session = Depends(get_db)):
    recurso = db.query(Recurso).filter(Recurso.id == recurso_id).first()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
    recurso.activo = False
    db.commit()
    return {"mensaje": "Recurso eliminado correctamente"}

@router.get("/{recurso_id}/horarios", response_model=List[HorarioResponse])
def listar_horarios(recurso_id: int, db: Session = Depends(get_db)):
    return db.query(Horario).filter(Horario.recurso_id == recurso_id, Horario.activo == True).all()

@router.post("/{recurso_id}/horarios", response_model=HorarioResponse)
def crear_horario(recurso_id: int, horario: HorarioCreate, db: Session = Depends(get_db)):
    # Verificar que no haya superposición
    existentes = db.query(Horario).filter(
        Horario.recurso_id == recurso_id,
        Horario.dia == horario.dia,
        Horario.activo == True
    ).all()
    for h in existentes:
        if not (horario.hora_fin <= h.hora_inicio or horario.hora_inicio >= h.hora_fin):
            raise HTTPException(status_code=400, detail="El horario se superpone con uno existente")
    nuevo = Horario(**horario.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.delete("/{recurso_id}/horarios/{horario_id}")
def eliminar_horario(recurso_id: int, horario_id: int, db: Session = Depends(get_db)):
    horario = db.query(Horario).filter(Horario.id == horario_id, Horario.recurso_id == recurso_id).first()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    horario.activo = False
    db.commit()
    return {"mensaje": "Horario eliminado correctamente"}
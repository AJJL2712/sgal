from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database import engine, Base
from app.routers import auth
from app.routers import usuarios
from app.models import usuario, recurso, horario
from app.routers import recursos

load_dotenv()

app = FastAPI(
    title="SGAL - Sistema de Gestión de Aulas y Laboratorios",
    description="API para la gestión de aulas y laboratorios de la PUCE",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(recursos.router)

@app.get("/")
def root():
    return {"mensaje": "Bienvenido al SGAL - PUCE"}
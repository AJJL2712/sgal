from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    contrasena: str
    rol: str

class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    email: str
    rol: str
    activo: bool

    class Config:
        from_attributes = True

class Login(BaseModel):
    email: EmailStr
    contrasena: str

class Token(BaseModel):
    access_token: str
    token_type: str
    rol: str
    nombre: str
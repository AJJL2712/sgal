from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
import os

def hashear_contrasena(contrasena: str):
    return bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verificar_contrasena(contrasena: str, hash: str):
    return bcrypt.checkpw(contrasena.encode('utf-8'), hash.encode('utf-8'))

def crear_token(data: dict):
    datos = data.copy()
    expira = datetime.utcnow() + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    datos.update({"exp": expira})
    return jwt.encode(datos, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
"""Sirve la landing y recibe los mensajes de su formulario de contacto.

Un solo servicio: la página (rutas relativas) y una API mínima.
- POST /api/contacto  guarda el mensaje (SQLite de la biblioteca estándar).
- GET  /api/mensajes  los lista para el dueño, con la cabecera X-Clave-Admin
  igual a la variable de entorno CLAVE_ADMIN (sin ella, la ruta no existe).
"""
from __future__ import annotations

import os
import re
import secrets
import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator

_RAIZ = Path(__file__).resolve().parent.parent
_FRONT = _RAIZ / "frontend"
_DB = Path(os.environ.get("CONTACTO_DB") or (_RAIZ / "data" / "contacto.db"))
_CANDADO = threading.Lock()
_CORREO = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@contextmanager
def _conexion():
    """Abre, confirma y CIERRA. `with sqlite3.connect()` solo confirma: deja
    la conexión abierta y el archivo bloqueado."""
    _DB.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(_DB)
    try:
        con.execute(
            "CREATE TABLE IF NOT EXISTS mensajes ("
            " id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL,"
            " contacto TEXT NOT NULL, interes TEXT NOT NULL DEFAULT '',"
            " mensaje TEXT NOT NULL, creado_en TEXT NOT NULL)"
        )
        yield con
        con.commit()
    finally:
        con.close()


class MensajeIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    contacto: str = Field(min_length=5, max_length=120)
    mensaje: str = Field(min_length=10, max_length=2000)
    interes: str = Field(default="", max_length=120)
    # Campo trampa: invisible para personas, los robots lo rellenan.
    web: str = Field(default="", max_length=200)

    @field_validator("nombre", "mensaje", "interes")
    @classmethod
    def _limpio(cls, v: str) -> str:
        return v.strip()

    @field_validator("contacto")
    @classmethod
    def _contacto(cls, v: str) -> str:
        v = v.strip()
        if _CORREO.match(v) or ("@" not in v and len(re.sub(r"\D", "", v)) >= 7):
            return v
        raise ValueError("Escribe un correo válido o un teléfono con al menos 7 dígitos.")


app = FastAPI(title='Don Bigote Premium Club')


@app.get("/api/salud")
def salud() -> dict:
    return {"ok": True}


@app.post("/api/contacto", status_code=201)
def recibir(m: MensajeIn) -> dict:
    if m.web:
        return {"ok": True}  # robot: se le contesta igual y no se guarda nada
    with _CANDADO, _conexion() as con:
        con.execute(
            "INSERT INTO mensajes (nombre, contacto, interes, mensaje, creado_en) VALUES (?,?,?,?,?)",
            (m.nombre, m.contacto, m.interes, m.mensaje,
             datetime.now(timezone.utc).isoformat(timespec="seconds")),
        )
    return {"ok": True}


@app.get("/api/mensajes")
def mensajes(x_clave_admin: str = Header(default="")) -> dict:
    clave = os.environ.get("CLAVE_ADMIN", "")
    if not clave:
        raise HTTPException(404, "Define CLAVE_ADMIN en el entorno para leer los mensajes.")
    if not secrets.compare_digest(x_clave_admin, clave):
        raise HTTPException(401, "Clave incorrecta.")
    with _conexion() as con:
        filas = con.execute(
            "SELECT id, nombre, contacto, interes, mensaje, creado_en FROM mensajes ORDER BY id DESC LIMIT 500"
        ).fetchall()
    campos = ("id", "nombre", "contacto", "interes", "mensaje", "creado_en")
    return {"total": len(filas), "mensajes": [dict(zip(campos, f)) for f in filas]}


app.mount("/static", StaticFiles(directory=str(_FRONT)), name="static")


@app.get("/")
def index():
    return FileResponse(str(_FRONT / "index.html"))

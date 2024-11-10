from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Modelo de Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True)
    password = db.Column(db.String(128), nullable=False)
    nombre = db.Column(db.String(100), nullable=True)  # Nuevo campo para nombre
    apellidos = db.Column(db.String(100), nullable=True)  # Nuevo campo para apellidos
    fecha_de_nacimiento = db.Column(db.Date, nullable=True)  # Nuevo campo para fecha de nacimiento
    direccion = db.Column(db.String(200), nullable=True)
    latitud = db.Column(db.Float, nullable=True)
    longitud = db.Column(db.Float, nullable=True)
    public_id = db.Column(db.String(200), nullable=True)  # Cambiado a opcional


    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "fecha_de_nacimiento": self.fecha_de_nacimiento.isoformat() if self.fecha_de_nacimiento else None,
            "direccion": self.direccion,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "public_id": self.public_id
        }

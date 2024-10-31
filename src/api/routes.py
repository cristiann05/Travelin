from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import json  # Asegúrate de importar el módulo json

#JWT
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Obtener todos los usuarios
@api.route('/usuarios', methods=['GET'])
def get_all_users():
    users = User.query.all()  
    users_serialized = [user.serialize() for user in users]  
    return jsonify(users_serialized), 200  

# Obtener un usuario por su ID
@api.route('/usuarios/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)  
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404  
    
    return jsonify(user.serialize()), 200  

@api.route('/usuarios/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Busca el usuario en la base de datos
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Obtener los datos de la solicitud
    data = request.get_json()

    # Actualiza las propiedades del usuario
    if 'difficulties' in data:
        user.difficulties = data['difficulties']  # Se espera que sea un string
    if 'preferred_languages' in data:
        user.preferred_languages = data['preferred_languages']  # Se espera que sea un string

    # Guarda los cambios en la base de datos
    db.session.commit()

    # Devuelve la representación serializada del usuario actualizado
    return jsonify(user.serialize()), 200

# Registro de usuario
@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    username = request.json.get("username", None)  # Obtener el username opcional

    # Verifica que los campos no estén vacíos
    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    # Verifica que el email no esté registrado previamente
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Crear nuevo usuario
    new_user = User(email=email, password=password, username=username)  # Asigna username
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado exitosamente"}), 201


# Login de usuario
@api.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Verifica que los campos no estén vacíos
    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    # Verificar que el usuario existe
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "El usuario no existe"}), 401

    # Verificar que la contraseña es correcta
    if user.password != password:
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    # Generar JWT Token
    access_token = create_access_token(identity=user.id)

    # Supongamos que tu modelo de usuario tiene los atributos `username`, `direccion`, `latitud`, y `longitud`
    return jsonify({
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username,        # Asegúrate de que tu modelo de usuario tenga este campo
        "direccion": user.direccion,      # Lo mismo aquí
        "latitud": user.latitud,          # Y aquí
        "longitud": user.longitud          # Y aquí
    }), 200

# Ruta para crear o actualizar el perfil del usuario
@api.route('/crear_perfil', methods=['PUT'])
@jwt_required()  # Requiere autenticación
def create_or_update_profile():
    # Obtiene el ID del usuario autenticado
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Verifica si el usuario existe en la base de datos
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Obtiene los datos enviados en la solicitud
    data = request.get_json()
    
    # Actualiza el nombre de usuario si está presente en los datos
    if 'username' in data:
        user.username = data['username']
    
    # Actualiza la dirección, latitud y longitud si están presentes en los datos
    if 'direccion' in data:
        user.direccion = data['direccion']
    if 'latitud' in data:
        user.latitud = data['latitud']
    if 'longitud' in data:
        user.longitud = data['longitud']

    # Guarda los cambios en la base de datos
    db.session.commit()

    return jsonify({"msg": "Perfil actualizado correctamente", "user": user.serialize()}), 200



if __name__ == '__main__':
    api.run(debug=True)
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime

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

# Actualizar usuario
@api.route('/usuarios/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Busca el usuario en la base de datos
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Obtener los datos de la solicitud
    data = request.get_json()

    # Actualiza las propiedades del usuario
    if 'nombre' in data:
        user.nombre = data['nombre']
    if 'apellidos' in data:
        user.apellidos = data['apellidos']
    if 'fecha_de_nacimiento' in data:
        try:
            user.fecha_de_nacimiento = datetime.strptime(data['fecha_de_nacimiento'], '%d-%m-%Y').date()
        except ValueError:
            return jsonify({"msg": "Formato de fecha incorrecto. Use DD-MM-AAAA."}), 400
    if 'direccion' in data:
        user.direccion = data['direccion']
    if 'latitud' in data:
        user.latitud = data['latitud']
    if 'longitud' in data:
        user.longitud = data['longitud']
    if 'public_id' in data:
        user.public_id = data['public_id']

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
    nombre = request.json.get("nombre", None)  # Nuevo campo para nombre
    apellidos = request.json.get("apellidos", None)  # Nuevo campo para apellidos
    fecha_de_nacimiento = request.json.get("fecha_de_nacimiento", None)  # Nuevo campo para fecha de nacimiento
    public_id = request.json.get("public_id", None)  # Nuevo campo para fecha de nacimiento

    # Verifica que los campos no estén vacíos
    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    # Verifica que el email no esté registrado previamente
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Crear nuevo usuario
    new_user = User(
        email=email, 
        password=password, 
        username=username, 
        nombre=nombre, 
        apellidos=apellidos, 
        fecha_de_nacimiento=fecha_de_nacimiento,
        public_id=public_id
    )
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

    # Incluir los nuevos campos `nombre`, `apellidos` y `fecha_de_nacimiento` en la respuesta
    return jsonify({
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username,
        "nombre": user.nombre,
        "apellidos": user.apellidos,
        "fecha_de_nacimiento": user.fecha_de_nacimiento.strftime('%d-%m-%Y') if user.fecha_de_nacimiento else None,
        "direccion": user.direccion,
        "latitud": user.latitud,
        "longitud": user.longitud
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
    
    # Actualiza los datos del usuario en función de la información proporcionada
    if 'username' in data:
        user.username = data['username']
    if 'nombre' in data:
        user.nombre = data['nombre']
    if 'apellidos' in data:
        user.apellidos = data['apellidos']
    if 'fecha_de_nacimiento' in data:
        try:
            user.fecha_de_nacimiento = datetime.strptime(data['fecha_de_nacimiento'], '%d-%m-%Y').date()
        except ValueError:
            return jsonify({"msg": "Formato de fecha incorrecto. Use DD-MM-AAAA."}), 400
    if 'direccion' in data:
        user.direccion = data['direccion']
    if 'latitud' in data:
        user.latitud = data['latitud']
    if 'longitud' in data:
        user.longitud = data['longitud']
    if 'public_id' in data:
        user.public_id = data['public_id']

    # Guarda los cambios en la base de datos
    db.session.commit()

    return jsonify({"msg": "Perfil actualizado correctamente", "user": user.serialize()}), 200

if __name__ == '__main__':
    app = Flask(__name__)
    app.register_blueprint(api)
    app.run(debug=True)

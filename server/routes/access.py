from flask import Blueprint, request
from pydantic import BaseModel, ValidationError, Field

from services.database import DatabaseService
from services.sessions import SessionsManager


# Define the router
access_router = Blueprint('access_router', __name__ , url_prefix='/api/access')

class LoginData(BaseModel):
    username: str = Field(max_length=16, min_length=1)
@access_router.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        login = LoginData(**data)
        
        # Clean the password before querying the database
        login.password = login.password.replace("'", "").replace('"', '')
        
        # Check if the user exists
        user = DatabaseService.get_instance().get("users", "id", f"username = 'admin' AND password = '{login.password}'")
        if user:
            return {"token": SessionsManager.get_instance().create_session()}, 200
        return {"error": "Invalid credentials"}, 401
    except ValidationError as e:
        return {"error": e.errors()}, 400
    

@access_router.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    if SessionsManager.get_instance().verify_session(token):
        SessionsManager.get_instance().delete_session(token)  # Delete the session from the database
        return {"success": True}, 200
    return {"error": "Invalid token"}, 401


@access_router.route('/verify-admin', methods=['GET'])
def verify_admin():
    result = DatabaseService.get_instance().get("users", "id", "username = 'admin'")
    if result:
        return {"status": True}, 200
    else :
        return {"status": False}, 200
    
class RegisterData(BaseModel):
    password: str = Field(max_length=16, min_length=1)
@access_router.route('/register-admin', methods=['POST'])
def register_admin():
    data = request.get_json()
    if DatabaseService.get_instance().get("users", "id", "username = 'admin'"):
        return {"error": "Admin already exists"}, 400
    DatabaseService.get_instance().insert("users", {"username": "admin", "password": data.get("password")})
    return {"success": True}, 200
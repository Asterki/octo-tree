from flask import Blueprint, request
from pydantic import BaseModel, ValidationError, Field

from services.database import DatabaseService

# Define the router
routines_router = Blueprint('routines_router', __name__ , url_prefix='/api/routines')

# Get the current routines
@routines_router.route('/get', methods=['GET'])
def get():
    # TODO: Add authentication
    
    # Get the routines from the database
    routines = DatabaseService.get_instance().get("routines", doc_count=100)
    return {"routines": routines}, 200
    
    
class AddRoutineData(BaseModel):
    name: str = Field(max_length=16, min_length=1)
    time: int
    action: str = Field(max_length=16, min_length=1)
    repeat: str = Field(max_length=16, min_length=1)
@routines_router.route('/add', methods=['POST'])
def add():
    try: 
        # TODO: Add authentication
        data = request.get_json()
        routine = AddRoutineData(**data)
        
        # Insert the routine into the database
        DatabaseService.get_instance().insert("routines", routine.dict())
        
        return {"success": True}, 200
    except ValidationError as e:
        return {"error": e.errors()}, 400


class UpdateRoutineData(BaseModel):
    id: int
    name: str = Field(max_length=16, min_length=1)
    time: int
    action: str = Field(max_length=16, min_length=1)
    repeat: str = Field(max_length=16, min_length=1)
@routines_router.route('/update', methods=['POST'])
def update():
    try:
        data = request.get_json()
        routine = UpdateRoutineData(**data)

        # Update the routine in the database
        DatabaseService.get_instance().update("routines", routine.dict(), f"id = {routine.id}")

        return {"success": True}, 200
    except ValidationError as e:
        return {"error": e.errors()}, 400
    

class RemoveRoutineData(BaseModel):
    id: int
@routines_router.route('/delete', methods=['POST'])
def delete():
    try:
        data = request.get_json()
        routine = RemoveRoutineData(**data)

        # Delete the routine from the database
        DatabaseService.get_instance().delete("routines", f"id = {routine.id}")

        return {"success": True}, 200
    except ValidationError as e:
        return {"error": e.errors()}, 400
        
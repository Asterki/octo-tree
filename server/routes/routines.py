from flask import Blueprint

from services.database import DatabaseService

# Define the router
routines_router = Blueprint('routines_router', __name__ , url_prefix='/api/routines')

# Get the current routines
@routines_router.route('/get')
def get():
    # TODO: Add authentication
    
    # Get the routines from the database
    routines = DatabaseService.get_instance().get("routines", doc_count=100)
    return {"routines": routines}, 200
    
    
@routines_router.route('/add')
def add():
    # TODO: Add authentication
    pass
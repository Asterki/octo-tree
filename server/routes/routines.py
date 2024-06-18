from flask import Blueprint

# Define the router
routines_router = Blueprint('routines_router', __name__ , url_prefix='/api/routines')

# Get the current routines
@routines_router.route('/get')
def get():
    return "Hello World!", 200

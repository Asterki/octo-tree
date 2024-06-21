from flask import Flask

# Import the routes
import routes.routines as routines
import routes.access as access

class RouterService:
    def __init__(self, app: Flask):
        # Initialize RouterService with a Flask app.
        self.app = app
        
    def register_routes(self):
        # Register the routes with the Flask app.
        self.app.register_blueprint(routines.routines_router)
        self.app.register_blueprint(access.access_router)
        
    def serve_static(self):
        # Serve static files with the Flask app.
        @self.app.route('/')
        def index():
            return self.app.send_static_file('index.html')
        
        @self.app.route('/<path:path>')
        def static_file(path):
            try:
                return self.app.send_static_file(path)
            except FileNotFoundError:
                return "File not found", 404
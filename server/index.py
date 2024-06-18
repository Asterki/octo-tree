from flask import Flask, send_from_directory
import os

from services.socket import SocketService
from services.database import DatabaseService

database = DatabaseService().get_instance()
class App:
    def __init__(self):
        # Call the services 
        self.app = Flask(__name__, static_folder='dist')
        self.socket_server = SocketService(self.app).get_instance(self.app)
        
        self.register_routes()
        self.start_app()
        
    def register_routes(self):
        # Load static files from the client
        @self.app.route('/', defaults={'path': ''})
        @self.app.route('/<path:path>')
        def serve(path):
            if path != "" and os.path.exists(self.app.static_folder + '/' + path):
                return send_from_directory(self.app.static_folder, path)
            else:
                return send_from_directory(self.app.static_folder, 'index.html')
            
        @self.app.route('/api/routines', methods=['GET'])
        def get_routines():
            routines = database.get("routines")
            return {"routines": routines}
        
    # Run the app
    def start_app(self):
        self.app.run()
        
        
if __name__ == "__main__":
    App()
    
from flask import Flask

from services.socket import SocketService
from services.database import DatabaseService

class App:
    def __init__(self):
        self.app = Flask(__name__)
        self.socket_server = SocketService(self.app).get_instance(self.app)
        self.database = DatabaseService().get_instance()
        
        self.register_routes()
        self.start_app()
        
    def register_routes(self):
        @self.app.route("/")
        def index():
            return "Hello World"
        
    def start_app(self):
        self.app.run()
        
        
if __name__ == "__main__":
    App()
    
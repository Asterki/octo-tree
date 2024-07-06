"""
Author: Fernando Rivera (Asterki)
www.asterki.com
Source code can be found at:
https://github.com/Asterki/octo-tree
"""


from flask import Flask
from flask_cors import CORS
from waitress import serve
from dotenv import load_dotenv

from services.socket import SocketService
from services.board import BoardService
from routes.router import RouterService

load_dotenv()

class App:
    def __init__(self):
        self.app = Flask(__name__, static_folder='dist')
        CORS(self.app)
        
        self.register_services()
        
    def register_services(self):
        self.router = RouterService(self.app).register_routes()
        self.socket_server = SocketService.get_instance(self.app)
        self.board = BoardService.get_instance()
        
    def start_app(self):
        serve(self.app, host='0.0.0.0', port=5000)
        # self.app.run()

if __name__ == "__main__":
    app = App()
    app.start_app()
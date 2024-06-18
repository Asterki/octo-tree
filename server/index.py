"""
Author: Fernando Rivera (Asterki)
www.asterki.com
Source code can be found at:
https://github.com/Asterki/octo-tree
"""


from flask import Flask

from services.socket import SocketService
from services.board import BoardService
from routes.router import RouterService

class App:
    def __init__(self):
        self.app = Flask(__name__, static_folder='dist')
        self.register_services()
        
    def register_services(self):
        self.socket_server = SocketService.get_instance(self.app)
        self.board = BoardService.get_instance()
        self.router = RouterService(self.app).register_routes()
        
    def start_app(self):
        self.app.run()

if __name__ == "__main__":
    app = App()
    app.start_app()
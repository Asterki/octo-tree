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
import asyncio

from services.socket import SocketService
from services.soil import SoilService
from routes.router import RouterService
from services.database import DatabaseService

load_dotenv()

class App:
    def __init__(self):
        self.app = Flask(__name__, static_folder="dist")
        CORS(self.app)

        self.register_services()

    def register_services(self):
        self.router = RouterService(self.app).register_routes()
        self.socket_server = SocketService.get_instance(self.app)

    async def start_app(self):
        db_service = DatabaseService.get_instance()
        await db_service.connect()
        serve(self.app, host="0.0.0.0", port=5000)
        await db_service.disconnect()

if __name__ == "__main__":
    # Start the app in async mode
    asyncio.run(App().start_app())
import flask_socketio
import pyfirmata
import time
import threading
from datetime import datetime
import time

from services.database import DatabaseService

board = pyfirmata.Arduino("COM9")

board_thread = pyfirmata.util.Iterator(board)
board_thread.start()

global_date = 0
def cosa():
    while True:
        time.sleep(2)
        print(global_date, time.time())

        if ((time.time() * 1000) > global_date) and global_date != 0:
            while True:
                board.digital[2].write(1)
                time.sleep(2)
                board.digital[2].write(0)
                time.sleep(2)

threading.Thread(target=cosa).start()

class SocketService:
    instance = None

    def _init_(self, app):  # The app is passed as an argument, flask app instance
        self.app = app
        self.servo_pin = board.get_pin("d:9:s")
        
        self.socketio = flask_socketio.SocketIO(self.app, cors_allowed_origins="*")

        # Register events
        self.register_server_events()
        self.register_client_events()

        if SocketService.instance is None:
            SocketService.instance = self

    def get_instance(self, app):
        if self.instance is None:
            self.instance = SocketService(app)
        return self.instance

    def register_server_events(self):
        @self.socketio.on("connect")
        def test_connect(auth):
            print("Client connected")

        @self.socketio.on("disconnect")
        def test_disconnect():
            print("Client disconnected")

    def register_client_events(self):
        @self.socketio.on("relay")
        def relays(data):
            relays = [2, 3, 4, 5]
            board.digital[relays[data["relay"]-1]].write(data["value"])
            
        @self.socketio.on("angle")
        def angle(data):
            self.servo_pin.write(0)
            time.sleep(0.1)
            
            for i in range(0,15, 30, 45, 60,75,90):
                print(i)
                self.servo_pin.write(i)
                time.sleep(0.5)

        @self.socketio.on("date")
        def datething(data):
            global_date = data
            print(global_date)
            

    def start_socket_server(self):
        self.socketio.run(self.app)

import flask_socketio

import pyfirmata
import time

board = pyfirmata.Arduino("/dev/ttyACM0")

board_thread = pyfirmata.util.Iterator(board)
board_thread.start()

# Get pin 10, digital, output
lenPin = board.get_pin("d:10:o")

class SocketService:
    instance = None

    def __init__(self, app):  # The app is passed as an argument, flask app instance
        self.app = app
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
        @self.socketio.on("light")
        def handle_light(data):
            print(data)
            if data["value"] == "on":
                board.digital[10].write(1)
                board.digital[11].write(1)
                board.digital[12].write(1)
                board.digital[13].write(1)
            else:
                board.digital[10].write(0)
                board.digital[11].write(0)
                board.digital[12].write(0)
                board.digital[13].write(0)

            # self.socketio.emit("light", data, broadcast=True)

    def start_socket_server(self):
        self.socketio.run(self.app)

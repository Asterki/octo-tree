import flask_socketio
import pyfirmata


board = pyfirmata.Arduino("/dev/ttyACM0")

board_thread = pyfirmata.util.Iterator(board)
board_thread.start()

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
        @self.socketio.on("test1")
        def test1(data):
            print("Test event received")
            if data["value"] == "on":
                board.digital[12].write(1)
            else:
                board.digital[12].write(0)
            
        @self.socketio.on("test2")
        def test2(data):
            print("Test event received")
            if data["value"] == "on":
                board.digital[11].write(1)
            else:
                board.digital[11].write(0)

    def start_socket_server(self):
        self.socketio.run(self.app)

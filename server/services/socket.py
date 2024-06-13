import flask_socketio
import pyfirmata
import time

board = pyfirmata.Arduino("/dev/ttyACM1")

board_thread = pyfirmata.util.Iterator(board)
board_thread.start()


class SocketService:
    instance = None

    def __init__(self, app):  # The app is passed as an argument, flask app instance
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
            time.sleep(2)
            
            for i in range(0, 90, 10):
                print(i)
                self.servo_pin.write(i)
                time.sleep(0.5)

    def start_socket_server(self):
        self.socketio.run(self.app)

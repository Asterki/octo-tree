from flask_socketio import SocketIO

class SocketService:
    _instance = None
    
    @classmethod
    def get_instance(cls, app):
        if cls._instance is None:
            cls._instance = SocketService(app)
        return cls._instance

    def __init__(self, app):
        self.app = app
        self.socketio = SocketIO(self.app, cors_allowed_origins="*", logger=False, engineio_logger=False)
        self.register_server_events()

    def register_server_events(self):
        self.socketio.on("connect")(self.test_connect)
        self.socketio.on("disconnect")(self.test_disconnect)

    def test_connect(self, auth):
        print("Client connected")

    def test_disconnect(self):
        print("Client disconnected")

    def start_socket_server(self):
        self.socketio.run(self.app, logger=False, engineio_logger=False)
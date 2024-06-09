import flask_socketio

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
        pass

    def start_socket_server(self):
        self.socketio.run(self.app)

import flask_socketio

class SocketService:
    instance = None

    def __init__(self, app):  # The app is passed as an argument, flask app instance
        self.app = app
        self.socketio = flask_socketio.SocketIO(self.app, cors_allowed_origins="*")

        if SocketService.instance is None:
            SocketService.instance = self
            
    def get_instance(self, app):
        if self.instance is None:
            self.instance = SocketService(app)
        return self.instance
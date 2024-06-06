from flask import Flask
import flask_socketio


class App:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config["SECRET"] = "secret!"
        self.socketio = flask_socketio.SocketIO(self.app, cors_allowed_origins="*")
        
        @self.socketio.on("connect")
        def test_connect(auth):
            print("Client connected")


        @self.socketio.on("disconnect")
        def test_disconnect():
            print("Client disconnected")

        @self.socketio.on("random")
        def handle_random(data):
            print("Received data: ", data)
            self.socketio.emit("random", data)

        self.start_app()
        
    def start_app(self):
        self.socketio.run(self.app)
        
        
if __name__ == "__main__":
    App()
    
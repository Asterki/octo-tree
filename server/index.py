from flask import Flask
import flask_socketio

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"


socketio = flask_socketio.SocketIO(app, cors_allowed_origins="*")


@socketio.on("connect")
def test_connect(auth):
    print("Client connected")


@socketio.on("disconnect")
def test_disconnect():
    print("Client disconnected")

@socketio.on("random")
def handle_random(data):
    print("Received data: ", data)
    socketio.emit("random", data)


if __name__ == "__main__":
    socketio.run(app)

class App:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config["SECRET"] = "secret!"
        self.socketio = flask_socketio.SocketIO(self.app, cors_allowed_origins="*")
        
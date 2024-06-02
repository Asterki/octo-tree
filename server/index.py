from flask import Flask
from flask_cors import CORS

from waitress import serve

class App:
    def __init__(self, port=8080):
        self.app = Flask(__name__)
        CORS(self.app)

        self.port = port

    def run(self):
        @self.app.route('/')
        def index():
            return 'Hello, World!'
        
        serve(self.app, host='0.0.0.0', port=self.port)
        print(f"Server is running on port {self.port}")

app = App()
app.run()
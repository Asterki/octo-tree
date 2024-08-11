from flask import Flask
from waitress import serve

app = Flask(__name__)

@app.route("/")
def hello_world():
    print("Hello, World!")
    return "<p>Hello, World!</p>"

@app.route("/update")
def e():
    print("Hello, World!")
    return "<p>Hello, World!</p>"

@app.route("/channels/*")
def a():
    print("Hello, World!")
    return "<p>Hello, World!</p>"

serve(app, host='0.0.0.0', port=5000)

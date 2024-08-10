from flask import Blueprint, request
from pydantic import BaseModel, ValidationError, Field

from services.database import DatabaseService

# Define the router
soil_router = Blueprint("soil_router", __name__, url_prefix="/api/soil")


@soil_router.route("/get", methods=["GET"])
def get():
    return {"soil": "soil"}, 200


switch = "on"
@soil_router.route("/ping", methods=["GET"])
def ping():
    global switch
    switch = "on" if switch == "off" else "off"
    return str(switch), 200

switch = 0
@soil_router.route("/getping", methods=["GET"])
def getping():
    return str(switch), 200
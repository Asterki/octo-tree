from flask import Blueprint, request
from pydantic import BaseModel, ValidationError, Field

from services.database import DatabaseService

# Define the router
soil_router = Blueprint("soil_router", __name__, url_prefix="/api/soil")


@soil_router.route("/get", methods=["GET"])
def get():
    return {"soil": "soil"}, 200

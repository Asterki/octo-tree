from flask import Blueprint, request
from pydantic import BaseModel, ValidationError, Field

from server.routes import router
from services.accounts import AccountManager

# Define the router
accounts_router = Blueprint("accounts_router", __name__, url_prefix="/api/accounts")


class RegisterAccountData(BaseModel):
    password: str = Field(max_length=16, min_length=1)
    username: str = Field(max_length=16, min_length=1)
@accounts_router.route("/register", methods=["GET"])
def register_account():
    try:
        data = request.get_json()
        account = RegisterAccountData(**data)
        
        # Check if the account already exists
        if AccountManager.get_instance().verify_account(account.username, account.password):
            return {"error": "Account already exists"}, 400

        # Create the account
        if AccountManager.get_instance().create_account(
            account.username, account.password
        ):
            return {"success": True}, 200
    except ValidationError as e:
        return {"error": e.errors()}, 400
    return {"error": "Failed to create account"}, 400


class DeleteAccouintData(BaseModel):
    password : str = Field(max_length=16, min_length=1)
@accounts_router.route("/delete-account", methods=["POST"])
def delete_account():
    try:
        data = request.get_json()
        account = DeleteAccouintData(**data)
        
        # Check if the account exists
        if not AccountManager.get_instance().verify_account(account.username, account.password):
            return {"error": "Account does not exist"}, 400

        # Delete the account
        if AccountManager.get_instance().delete_account(account.username):
            return {"success": True}, 200
    except ValidationError as e:
        return {"error": e.errors()}, 400
    return {"error": "Failed to delete account"}, 400
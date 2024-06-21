import jwt
import uuid
import os
import datetime

from services.database import DatabaseService


class SessionsManager:
    _instance = None

    def __init__(self):
        if SessionsManager._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            SessionsManager._instance = self

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = SessionsManager()
        return cls._instance

    def create_session(self):
        token = str(uuid.uuid4())
        expires = datetime.datetime.now() + datetime.timedelta(days=1)
        date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        secret = os.getenv("SESSION_SECRET")

        try:
            # Insert the session into the database
            DatabaseService.get_instance().insert(
                "sessions",
                {
                    "token": token,
                    "created_at": date,
                    "expires_at": expires.strftime("%Y-%m-%d %H:%M:%S"),
                },
            )
            # Return the token
            return jwt.encode(
                {"token": token, "expires": int(expires.timestamp() * 1000)}, secret, algorithm="HS256"
            )
        except Exception as e:
            print(e)
        return False

    def verify_session(self, token):
        secret = os.getenv("SESSION_SECRET")
        try:
            decoded = jwt.decode(token, secret, algorithms=["HS256"])
            session = DatabaseService.get_instance().get(
                "sessions", where=f"token = '{decoded['token']}'"
            )
            if session:
                session = session[0]
                if datetime.datetime.now() < datetime.datetime.strptime(
                    session[3], "%Y-%m-%d %H:%M:%S"
                ):  # Check if the session is still valid
                    return True
                else:
                    DatabaseService.get_instance().delete(
                        "sessions", f"token = '{decoded['token']}'"
                    )  # Delete the expired session
        except Exception as e:
            print(e)
        return False

    def delete_session(self, token):
        secret = os.getenv("SESSION_SECRET")

        try:
            decoded = jwt.decode(token, secret, algorithms=["HS256"])
            session = DatabaseService.get_instance().get(
                "sessions", where=f"token = '{decoded['token']}'"
            )
            if session:
                DatabaseService.get_instance().delete(
                    "sessions", f"token = '{decoded['token']}'"
                )  # Delete the session
        except Exception as e:
            print(e)
        finally:
            return True

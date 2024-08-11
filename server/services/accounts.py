import bcrypt
import asyncio
from concurrent.futures import ThreadPoolExecutor
from services.database import DatabaseService


class AccountManager:
    _instance = None

    def __init__(self):
        if AccountManager._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            AccountManager._instance = self

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = AccountManager()
        return cls._instance

    async def hash_password(self, password):
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as pool:
            hashed_password = await loop.run_in_executor(
                pool, bcrypt.hashpw, password.encode("utf-8"), bcrypt.gensalt()
            )
        return hashed_password

    async def create_account(self, username, password):
        try:
            # Hash the password asynchronously
            hashed_password = await self.hash_password(password)

            # Create the user in the database
            await DatabaseService.get_instance().get_db().create(
                "users",
                {
                    "username": username,
                    "password": hashed_password,
                },
            )
            return True
        except Exception as e:
            print(e)
        return False

    def verify_account(self, username):
        try:
            user = asyncio.get_running_loop().run(
                DatabaseService.get_instance()
                .get_db()
                .user.find_first(where={"username": username})
            )

            print(user)
            if user:
                return True
        except Exception as e:
            print(e)
        return False

    def delete_account(self, username):
        try:
            DatabaseService.get_instance().delete(
                "users", where=f"username = '{username}'"
            )
            return True
        except Exception as e:
            print(e)
        return False

    def update_account(self, username, password):
        try:
            DatabaseService.get_instance().update(
                "users",
                {
                    "password": password,
                },
                where=f"username = '{username}'",
            )
            return True
        except Exception as e:
            print(e)
        return False

    def get_account(self, username):
        try:
            user = DatabaseService.get_instance().get(
                "users", where=f"username = '{username}'"
            )
            if user:
                return user[0]
        except Exception as e:
            print(e)
        return False

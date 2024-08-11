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

    def create_account(self, username, password):
        try:
            DatabaseService.get_instance().insert(
                "users",
                {
                    "username": username,
                    "password": password,
                },
            )
            return True
        except Exception as e:
            print(e)
        return False

    def verify_account(self, username, password):
        try:
            user = DatabaseService.get_instance().get(
                "users", where=f"username = '{username}' AND password = '{password}'"
            )
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

import asyncio
from prisma import Prisma

class DatabaseService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DatabaseService()
        return cls._instance

    async def __init__(self):
        if DatabaseService._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            DatabaseService._instance = self
            db = Prisma()
            await db.connect()
        try:
            self.cursor.execute('''
                        CREATE TABLE IF NOT EXISTS routines (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            action TEXT NOT NULL,
                            time TEXT NOT NULL,
                            repeat TEXT NOT NULL
                        )
                    ''')

            self.cursor.execute('''
                        CREATE TABLE IF NOT EXISTS sessions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            token TEXT NOT NULL,
                            created_at TEXT NOT NULL,
                            expires_at TEXT NOT NULL
                        )''')

            self.cursor.execute('''
                        CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT NOT NULL,
                            password TEXT NOT NULL
                        )''')
        except Exception as e:
            print(e)

    async def connect(self):
        await self._db.connect()

    async def disconnect(self):
        await self._db.disconnect()

    def get_db(self):
        return self._db

    async def __del__(self):
        await self._db.disconnect()
        print("Database connection closed")
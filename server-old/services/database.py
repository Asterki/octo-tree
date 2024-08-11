import asyncio
from prisma import Prisma

class DatabaseService:
    __instance = None
    db = None

    @staticmethod
    def get_instance():
        if DatabaseService.__instance is None:
            DatabaseService()
        return DatabaseService.__instance

    def __init__(self):
        if DatabaseService.__instance is not None:
            raise Exception("This class is a singleton!")
        else:
            DatabaseService.__instance = self
            self.db = Prisma()

    async def connect(self):
        await self.db.connect()

    async def disconnect(self):
        await self.db.disconnect()

    def get_db(self):
        return self.db
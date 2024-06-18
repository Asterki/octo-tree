import sqlite3

class DatabaseService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DatabaseService()
        return cls._instance

    def __init__(self):
        if DatabaseService._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            DatabaseService._instance = self
            self.conn = sqlite3.connect('database.db', check_same_thread=False)
            self.cursor = self.conn.cursor()
            self.create_tables()

    def create_tables(self):
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
        except Exception as e:
            print(e)

    def get(self, table: str, columns="*", where=None, doc_count=0, doc_offset=0):
        query = f"SELECT {columns} FROM {table}"
        if where:
            query += f" WHERE {where}"
        if doc_count:
            query += f" LIMIT {doc_count}"
        if doc_offset:
            query += f" OFFSET {doc_offset}"
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def insert(self, table, data):
        keys = ', '.join(data.keys())
        values = ', '.join(['"' + str(value) + '"' for value in data.values()])
        try:
            self.cursor.execute(f'INSERT INTO {table} ({keys}) VALUES ({values})')
            self.conn.commit()
        except Exception as e:
            print(e)

    def update(self, table, data, where):
        set_values = ', '.join([f'{key} = "{value}"' for key, value in data.items()])
        try:
            self.cursor.execute(f'UPDATE {table} SET {set_values} WHERE {where}')
            self.conn.commit()
        except Exception as e:
            print(e)

    def delete(self, table, where):
        try:
            self.cursor.execute(f'DELETE FROM {table} WHERE {where}')
            self.conn.commit()
        except Exception as e:
            print(e)

    def flush(self, table):
        try:
            self.cursor.execute(f'DELETE FROM {table}')
            self.conn.commit()
        except Exception as e:
            print(e)

    def __del__(self):
        self.conn.close()
import sqlite3

class DatabaseService:
    instance = None

    def __init__(self):
        self.conn = sqlite3.connect('database.db')
        self.cursor = self.conn.cursor()
        self.create_tables()

        if DatabaseService.instance is None:
            DatabaseService.instance = self
            
    def get_instance(self):
        if self.instance is None:
            self.instance = DatabaseService()
        return self.instance
    
    # Create the tables in the database
    def create_tables(self):
        try:
            self.cursor.execute('''
                        CREATE TABLE IF NOT EXISTS employees (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            hired_since TEXT NOT NULL,
                            admin BOOLEAN NOT NULL,
                            phone_number TEXT NOT NULL,
                            movies_sold INTEGER NOT NULL,
                            password TEXT NOT NULL
                        )
                    ''')

        except Exception as e:
            print(e)
            return False
        
    # Get data from the database
    def get(self, table, columns="*", where=None, doc_count=0, doc_offset=0):
        query = f"SELECT {columns} FROM {table}"
        if where:
            query += f" WHERE {where}"
        if doc_count:
            query += f" LIMIT {doc_count}"
        if doc_offset:
            query += f" OFFSET {doc_offset}"
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    # Insert data into the database
    def insert(self, table, data):
        keys = ', '.join(data.keys())
        values = ', '.join(['"' + str(value) + '"' for value in data.values()])
        try:
            self.cursor.execute(f'INSERT INTO {table} ({keys}) VALUES ({values})')
            self.conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        
    # Update data in the database
    def update(self, table, data, where):
        set_values = ', '.join([f'{key} = "{value}"' for key, value in data.items()])
        try:
            self.cursor.execute(f'UPDATE {table} SET {set_values} WHERE {where}')
            self.conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        
    # Delete data from the database
    def delete(self, table, where):
        try:
            self.cursor.execute(f'DELETE FROM {table} WHERE {where}')
            self.conn.commit()
            return True
        except Exception as e:
            print(e)
            return False

    # Flush the table
    def flush(self, table):
        try:
            self.cursor.execute(f'DELETE FROM {table}')
            self.conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        
    # Close the connection
    def __del__(self):
        self.conn.close()
        
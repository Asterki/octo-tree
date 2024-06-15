import pyfirmata
import time
import threading
from datetime import datetime
import time

class BoardService:
    instance = None
    
    def __init__(self):
        self.board = pyfirmata.Arduino('/dev/ttyACM0')
        self.it = pyfirmata.util.Iterator(self.board)
        self.board.iterate()
        self.it.start()

        self.sensors = [
            self.board.get_pin('a:1:i'),
            self.board.get_pin('a:2:i'),
            self.board.get_pin('a:3:i'),
            self.board.get_pin('a:4:i'),
            self.board.get_pin('a:5:i'),
        ]
        
        if BoardService.instance is None:
            BoardService.instance = self
        
    def get_instance(self):
        if self.instance is None:
            self.instance = BoardService()
        return self.instance
    
    def get_board(self):
        return self.board

    def write_pin(self, pin, value):
        self.board.digital[pin].write(value)
        
    def read_sensor(self, sensor):
        self.sensors[sensor].enable_reporting()
        return self.sensors[sensor].read()

        
import threading

import pyfirmata
import time

class BoardService:
    instance = None
    
    def __init__(self):
        self.board = pyfirmata.Arduino('/dev/ttyACM0')
        self.it = pyfirmata.util.Iterator(self.board)
        self.board.iterate()
        self.it.start()

        self.led = self.board.get_pin('d:13:o')
        self.button = self.board.get_pin('d:2:i')
        
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
        
    def read_pin(self,):
        return self.button.read()

    def start(self):
        t = threading.Thread(target=self.blink)
        t.start()
        
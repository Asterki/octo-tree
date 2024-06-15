import pyfirmata
import time
import threading
from datetime import datetime
import time

class BoardService:
    instance = None
    
    def __init__(self):
        # Connect to the board
        self.board = pyfirmata.Arduino('/dev/ttyACM0')
        self.it = pyfirmata.util.Iterator(self.board)
        
        # Start the iterator
        self.board.iterate()
        self.it.start()

        # Define de Ax pins
        self.sensors = [
            self.board.get_pin('a:1:i'),
            self.board.get_pin('a:2:i'),
            self.board.get_pin('a:3:i'),
            self.board.get_pin('a:4:i'),
            self.board.get_pin('a:5:i'),
        ]
        
        self.servos = [
            self.board.get_pin('d:6:s'),
            self.board.get_pin('d:7:s'),
            self.board.get_pin('d:8:s'),
            self.board.get_pin('d:9:s'),
            self.board.get_pin('d:10:s'),
        ]
        
        # Singleton
        if BoardService.instance is None:
            BoardService.instance = self
        
    def get_instance(self):
        if self.instance is None:
            self.instance = BoardService()
        return self.instance
    
    def get_board(self):
        return self.board

    def write_pin(self, pin, value):
        self.board.digital[pin].write(value)  # Write the value to the pin
        
    def read_sensor(self, sensor):
        self.sensors[sensor].enable_reporting()  # Enable the reporting
        return self.sensors[sensor].read()  # Read the value

    def move_servo(self, servo, angle, speed):
        # Move the servo
        def move():
            for i in range(0, angle, speed):
                self.servos[servo].write(i) # Write the angle to the servo
                time.sleep(0.1)
            
        # Start the thread to avoid blocking the main thread
        threading.Thread(target=move).start()
        
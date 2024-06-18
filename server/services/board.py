import pyfirmata
import time
import threading

board = pyfirmata.Arduino('/dev/ttyACM1')
it = pyfirmata.util.Iterator(board)

sensors = [
    board.get_pin('a:1:i'),
    board.get_pin('a:2:i'),
    board.get_pin('a:3:i'),
    board.get_pin('a:4:i'),
    board.get_pin('a:5:i'),
]

servos = [
    board.get_pin('d:6:s'),
    board.get_pin('d:7:s'),
    board.get_pin('d:8:s'),
    board.get_pin('d:9:s'),
    board.get_pin('d:10:s'),
]

relay_pins = [
    board.get_pin('d:2:o'),
    board.get_pin('d:3:o'),
    board.get_pin('d:4:o'),
    board.get_pin('d:5:o'),
]

class BoardService:
    instance = None
    
    def __init__(self):
        # Connect to the board
        
        # Start the iterator
        # board.iterate()
        #self.it.start()

        
        
        # Singleton
        if BoardService.instance is None:
            BoardService.instance = self
        
    def get_instance(self):
        if self.instance is None:
            self.instance = BoardService()
        return self.instance
    
    def get_board(self):
        return board

    def write_pin(self, pin, value):
        board.digital[pin].write(value)  # Write the value to the pin
        
    def read_sensor(self, sensor):
        self.sensors[sensor].enable_reporting()  # Enable the reporting
        return self.sensors[sensor].read()  # Read the value
    
    def write_relay(self, relay, value):
        print(relay, value)
        relay_pins[relay].write(value)  # Write the value to the relay

    def move_servo(self, servo, angle, speed):
        # Move the servo
        def move():
            for i in range(0, angle, speed):
                self.servos[servo].write(i) # Write the angle to the servo
                time.sleep(0.1)
            
        # Start the thread to avoid blocking the main thread
        threading.Thread(target=move).start()
        
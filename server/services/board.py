import pyfirmata
import time
import threading

class BoardService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = BoardService()
        return cls._instance

    def __init__(self):
        if BoardService._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            BoardService._instance = self
            try:
                self._board = pyfirmata.Arduino('/dev/ttyACM1')  # Change this to the port your Arduino is connected to
                self._it = pyfirmata.util.Iterator(self._board)  # Create an iterator for the board
                self._it.start()
                
                # Initialize the pins
                self._sensors = [self._board.get_pin(f'a:{i}:i') for i in range(1, 6)]
                self._servos = [self._board.get_pin(f'd:{i}:s') for i in range(6, 11)]
                self._relay_pins = [self._board.get_pin(f'd:{i}:o') for i in range(2, 6)]
            except Exception as e:
                print(f"Failed to initialize board: {e}")

    def write_pin(self, pin, value):
        try:
            self._board.digital[pin].write(value)
        except IndexError:
            print(f"Pin {pin} does not exist.")

    def read_sensor(self, sensor):
        try:
            self._sensors[sensor].enable_reporting()
            return self._sensors[sensor].read()
        except IndexError:
            print(f"Sensor {sensor} does not exist.")

    def write_relay(self, relay, value):
        try:
            self._relay_pins[relay].write(value)
        except IndexError:
            print(f"Relay {relay} does not exist.")

    def move_servo(self, servo, angle, speed):
        try:
            def move():
                for i in range(0, angle, speed):
                    self._servos[servo].write(i)
                    time.sleep(0.1)

            threading.Thread(target=move).start()
        except IndexError:
            print(f"Servo {servo} does not exist.")
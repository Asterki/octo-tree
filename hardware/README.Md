# ESP32S3 Octo-Tree IoT System

This project is an IoT application for the ESP32S3 Dev Module, integrating sensor data collection, actuator control, and WebSocket communication to a remote server. The system monitors environmental factors such as temperature, humidity, light levels, and soil moisture, and allows remote control of devices like water pumps, LEDs, and servos.

## Features

- **BME280 Sensor**: Reads temperature, humidity, and pressure.
- **WiFi Connectivity**: Uses WiFiManager for seamless connection to WiFi networks.
- **WebSocket Communication**: Communicates with the Octo-Tree server using Socket.IO.
- **Actuator Control**: Controls an LED, a water pump, and a servo based on commands from the server.
- **Sensor Monitoring**: Sends sensor data (temperature, humidity, pressure, and light levels) to the server every 5 seconds.
- **Light Sensor-Based Servo Control**: Adjusts a servo to align solar panels based on light sensor data.

## Hardware

- **ESP32S3 Dev Module**
- **BME280 Sensor** (Temperature, Humidity, Pressure)
- **Light Sensors** (Analog)
- **Water Pump**
- **LED**
- **Servo Motor**
- **Soil Moisture Sensor**

### Pin Configuration

| Sensor/Actuator    | Pin         |
|--------------------|-------------|
| Humidity Sensor     | GPIO 17     |
| Light Sensor 1      | GPIO 4      |
| Light Sensor 2      | GPIO 16     |
| Water Pump Relay          | GPIO 15     |
| Soil Humidity Sensor| GPIO 7      |
| Servo Motor         | GPIO 10     |
| LED Light           | GPIO 11     |
| BME280 SDA          | GPIO 8      |
| BME280 SCL          | GPIO 9      |

## Installation

1. Clone or download this repository.
2. Install the following libraries in the Arduino IDE via Library Manager:
   - `Adafruit BME280`
   - `Adafruit Sensor`
   - `WiFiManager`
   - `SocketIOclient_Generic`
   - `WebSocketsClient_Generic`
   - `ArduinoJson`
3. Upload the code to your ESP32S3 Dev Module.
4. On the first boot, the device will open a WiFi access point named "Octo-Tree". Connect to it and configure the WiFi network.
5. The device will connect to the Octo-Tree server and start monitoring and controlling the devices.

## Configuration

- **Server URL**: `https://octo-tree.asterkionline.com`
- **Board ID** and **Board Key**: These should be set in the code for device authentication with the server.
- **WiFi**: Managed using WiFiManager. The device will automatically reconnect to the last known WiFi network or start the configuration portal if no network is found.

## Usage

The ESP32S3 Dev Module performs the following actions:

1. **Event Handling**: Responds to server events such as:
   - Turning the LED on or off.
   - Activating the water pump for a specified duration.
   - Adjusting the servo based on light sensor readings.

2. **Sensor Updates**: Periodically sends sensor data (temperature, humidity, pressure, light levels) to the server.

3. **Remote Control**: Actuators can be controlled remotely via events received through Socket.IO from the server.

## Example Events

### Turning on the LED

```json
{
  "event": "led",
  "params": {
    "state": 1
  }
}
```

### Activating the Water Pump for 10 seconds

```json
{
  "event": "pump",
  "params": {
    "time": 10
  }
}
```

## License

This project is licensed under the MIT License.

## Contact

For questions or support, reach out via the Octo-Tree project at [Asterki Tech](https://asterki.tech).
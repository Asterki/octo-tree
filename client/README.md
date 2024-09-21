# Octo-Tree Frontend

This is the frontend for the Octo-Tree IoT system, built using **React** with **TypeScript**. It communicates with the backend server via the API, allowing for real-time data display and remote control of IoT devices.

## Features

- **Real-Time Device Monitoring**: Displays sensor data such as temperature, humidity, pressure, and light levels.
- **Remote Control**: Send commands to IoT devices such as turning on/off LEDs, activating water pumps, and adjusting solar panel servos.
- **WebSocket Communication**: Enables real-time updates for device state changes and sensor data.
- **Simple Configuration**: Utilizes a single environment variable for easy setup.

## Installation

### Prerequisites

- **Node.js**: Ensure Node.js and npm are installed on your machine.

### Environment Variable

Create a `.env` file at the root of the project with the following content:

```bash
VITE_API_URL="http://localhost:3000"
```

This points to the backend server, where real-time updates and sensor data are handled.

### Steps

1. Clone or download this repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm run dev
   ```

4. Access the app at `http://localhost:5173` (default port for Vite).

## Usage

Once the app is running, it will connect to the backend server using the API URL defined in the `.env` file. You can view live data from the sensors and control the IoT devices.

### Pages

- **Dashboard**: Displays real-time sensor data and controls for IoT devices such as the LED, water pump, and solar panel servos.
- **Routines**: Manage device configurations and set thresholds for automated controls.

### Example Interactions

- **View Sensor Data**: The dashboard automatically updates with the latest readings for temperature, humidity, pressure, and light levels.
- **Control Devices**: Toggle the LED, run the water pump, or adjust the solar panel's servo motor.

## Technologies

- **React**: User interface development.
- **TypeScript**: Type-safe development.
- **Vite**: For a fast development environment.
- **Socket.IO**: Real-time communication with the backend.
- **Chart.js**: Showing real-time statistics.

## API

All API requests are made to the backend defined in the `VITE_API_URL` environment variable. Ensure that the backend is running and accessible.

### Example API Endpoints

- **GET /sensors**: Retrieve current sensor readings.
- **POST /control**: Send control commands for actuators like the LED or water pump.

## License

This project is licensed under the MIT License.

## Contact

For any questions or issues, feel free to contact the [Octo-Tree project](https://asterki.tech).
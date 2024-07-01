# Octo-Tree

This project is a web application that interfaces with an Arduino Uno board to monitor and control various sensors and actuators. The backend is built with Python, using Flask for the web framework, Socket.io for real-time communication, and SQLite for data storage. The frontend is developed with TypeScript, React, Socket.io, and TailwindCSS.

## Table of Contents

- [Octo-Tree](#octo-tree)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Hardware Requirements](#hardware-requirements)
  - [Software Requirements](#software-requirements)
  - [Installation](#installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Arduino Setup](#arduino-setup)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Authors](#authors)

## Features

- Real-time data visualization from Arduino sensors.
- Control actuators connected to the Arduino from the web app.
- Store and retrieve sensor data using SQLite.
- Responsive and modern UI with React and TailwindCSS.

## Hardware Requirements

- Arduino Uno board
- USB cable for Arduino
- Various sensors (e.g., temperature, humidity, light, etc.)
- Actuators (e.g., LEDs, relays, motors, etc.)
- Breadboard and jumper wires

## Software Requirements

- Python 3.x
- Node.js and npm
- Arduino IDE

## Installation

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/arduino-web-app.git
    cd arduino-web-app
    ```

2. Set up a virtual environment and install dependencies:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3. Run the Flask server:

    ```bash
    python app.py
    ```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

    ```bash
    cd frontend
    npm install
    ```

2. Start the development server:

    ```bash
    npm start
    ```

### Arduino Setup

1. Open the Arduino IDE and upload the provided sketch (`arduino/arduino_sketch.ino`) to your Arduino Uno board.
2. Ensure the correct serial port is selected.

## Usage

1. Ensure the Flask backend and React frontend servers are running.
2. Open your web browser and navigate to `http://localhost:3000`.
3. You should see the web app interface where you can monitor sensor data and control actuators.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code adheres to the project's coding standards and include appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Authors
- [Fernando Rivera](https://www.linkedin.com/in/fernando-rivera-asterki/)
- [Angel Portillo](https://www.instagram.com/ovando8155/)
- [Juan Ortíz](https://www.linkedin.com/in/juan-ortiz-0814b72b4/)
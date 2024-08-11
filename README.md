# Octo-Tree

This project is a web application that interfaces with an Arduino Uno board to monitor and control various sensors and actuators. The backend is built with Typescript, using Express for the web framework, Socket.io for real-time communication, and SQLite for data storage. The frontend is developed with TypeScript, React, Socket.io, and TailwindCSS.

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
    git clone https://github.com/asterki/octo-tree.git
    cd octo-tree
    ```

2. Navigate to the server directory:

    ```bash
    cd server
    ```

3. Set up the server and install dependencies:

    ```bash
    npm i
    ```

4. Run the Flask server:

    ```bash
    npm run dev
    ```

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

    ```bash
    cd client
    npm install
    ```

2. Start the development server:

    ```bash
    npm run dev
    ```

### Arduino Setup

1. Open the Arduino IDE and upload the provided sketch (`arduino/index.ino`) to your Arduino Uno board.
2. Ensure the correct serial port is selected.

## Usage

1. Ensure the Node backend and React frontend servers are running.
2. Open your web browser and navigate to `http://localhost:5173`.
3. You should see the web app interface where you can monitor sensor data and control actuators.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code adheres to the project's coding standards and include appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Authors
- [Fernando Rivera](https://www.linkedin.com/in/fernando-rivera-asterki/)
- [Angel Portillo](https://www.instagram.com/ovando8155/)
- [Juan Ortíz](https://www.linkedin.com/in/juan-ortiz-0814b72b4/)
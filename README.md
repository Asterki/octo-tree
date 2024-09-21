# Octo-Tree IoT Platform

**Octo-Tree** is an IoT platform designed to manage and monitor various hardware systems such as solar panels and soil moisture sensors. It integrates AI for image recognition and soil analysis, real-time communication with devices, and includes a frontend dashboard for user interaction. The project is structured into three main components: **Client**, **Server**, and **Hardware**.

## Table of Contents

- [Octo-Tree IoT Platform](#octo-tree-iot-platform)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Project Structure](#project-structure)
    - [Client](#client)
    - [Server](#server)
    - [Hardware](#hardware)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
    - [1. Running the Client](#1-running-the-client)
    - [2. Running the Server](#2-running-the-server)
    - [3. Running the Hardware](#3-running-the-hardware)
  - [License](#license)
  - [Contact](#contact)

## Overview

**Octo-Tree** is a complete IoT solution comprising:

- A **client** frontend built in TypeScript React.
- A **server** backend powered by TypeScript, Express, and Prisma with MySQLite database and integration with Azure services.
- **Hardware** components (ESP32 and other microcontrollers) that communicate with the server for data collection, control, and automation.

Each component works in tandem to provide seamless monitoring and control of IoT devices.

## Features

- **Real-time Data Communication**: Monitor and control devices in real-time using **Socket.IO**.
- **AI Integration**: Includes image recognition for solar panel and soil analysis using **Azure Cognitive Services**.
- **Frontend Dashboard**: A user-friendly dashboard for managing devices and viewing sensor data.
- **Automated Routines**: Set and manage automated tasks based on IoT sensor inputs.
- **Session and Security**: Secure user sessions and account management using **Redis** and **Express**.
- **Email Notifications**: Send notifications and alerts through email when specific conditions are met.

## Project Structure

```
octo-tree/
├── client/               # Frontend (React)
│   └── README.md         # Documentation for the client
├── server/               # Backend (Express, Prisma, Azure services)
│   └── README.md         # Documentation for the server
└── hardware/             # Hardware configuration and code (ESP32)
    └── README.md         # Documentation for hardware components
```

### Client

- Built with **TypeScript** and **React**.
- Uses **Vite** for fast development and build processes.
- Connects to the backend for real-time device management and AI-driven insights.

More details can be found in the [client README](client/README.md).

### Server

- Backend built with **TypeScript**, **Express**, **Prisma**, and **MySQLite**.
- Integrates **Azure Cognitive Services** for image recognition and **Azure OpenAI** for AI-driven features.
- Manages real-time communication with devices via **Socket.IO** and user sessions with **Redis**.

More details can be found in the [server README](server/README.md).

### Hardware

- **ESP32**-based hardware system for controlling devices such as LED arrays, sensors, and cameras.
- Communicates with the server using **WebSockets** and integrates various sensors like **BME280** for environmental monitoring.

More details can be found in the [hardware README](hardware/README.md).

## Installation

### Prerequisites

- **Node.js** (for client and server)
- **Redis** (for session management on the server)
- **MySQLite** (for the server's database)
- **Prisma** (for database schema and ORM)
- **ESP32 Development Kit** (for hardware)

### Clone the Repository

```bash
git clone https://github.com/Asterki/octo-tree.git
```

### Environment Variables

The project requires several environment variables to be set. Each component (client, server, and hardware) has its own specific configuration:

- For **client**, see [client/README.md](client/README.md).
- For **server**, see [server/README.md](server/README.md).
- For **hardware**, see [hardware/README.md](hardware/README.md).

## Running the Project

Once you have the environment set up, follow these steps to run the system:

### 1. Running the Client

Navigate to the `client` directory:

```bash
cd client
npm install
npm run dev
```

The client should now be available at `http://localhost:5173`.

### 2. Running the Server

Navigate to the `server` directory:

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

The server should be running on `http://localhost:3000`.

### 3. Running the Hardware

Follow the instructions in the [hardware/README.md](hardware/README.md) to set up and run the IoT hardware components.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or contributions, please reach out to the [Octo-Tree team](https://asterkionline.com).
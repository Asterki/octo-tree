# Vite React App with Redux Toolkit, Axios, and Socket.IO

This project is a Vite-based React application that utilizes Redux Toolkit for state management, Axios for API requests, and Socket.IO for real-time communication.

## Features

- **Vite**: Fast and efficient development server and build tool.
- **React**: Modern JavaScript library for building user interfaces.
- **Redux Toolkit**: Simplified Redux development with integrated tools.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Socket.IO**: Real-time bidirectional event-based communication.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.x or higher) and npm installed on your machine.
- The server code (located in a separate folder outside this project) must be running.
- Environment variables must be set.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Asterki/octo-tree.git
   cd vite-react-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root of the project and add the necessary environment variables.

   Example:
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run the server (outside of this folder):**

   Make sure your server is running, as the app depends on it for API requests and Socket.IO communication.

6. **Build for production:**
   ```bash
   npm run build
   ```

7. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Usage

- The application will be running on `http://localhost:3000` by default.
- Ensure the server is running on the specified URL in the environment variables for successful API requests and real-time communication.


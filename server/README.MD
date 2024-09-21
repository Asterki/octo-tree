# Octo-Tree Backend

This is the backend for the **Octo-Tree IoT system**, built using **TypeScript**, **Express**, and **Prisma** with **MySQLite** as the database. It provides APIs for IoT device management, real-time communication, AI services for image recognition and soil analysis, and integration with Azure for various services.

## Features

- **Real-Time Communication**: Supports real-time data and control using **Socket.IO**.
- **Image Recognition**: Integrates with **Azure Computer Vision** to analyze solar panel images for obstructions or damage.
- **Soil Analysis**: Uses **Azure Cognitive Services** for soil analysis from images.
- **OpenAI Integration**: Utilizes **Azure OpenAI** to provide AI-driven responses and interactions.
- **Session Management**: Manages user sessions with Redis.
- **Storage Services**: Connects to **Azure Storage** for file management and storage.
- **Emailer**: Sends notification emails.
- **Routine Management**: Automates IoT routines based on sensor data.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js and npm installed.
- **Prisma**: Used for database interaction. Prisma's MySQLite setup is required.
- **Redis**: Required for session management.

### Environment Variables

Create a `.env` file at the root of the project with the following variables:

```bash
# Session configuration
SESSION_SECRET="your_secret_key"
REDIS_URL="redis://localhost:6379"

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=octotrstorage;AccountKey=your_account_key;EndpointSuffix=core.windows.net"

# Azure Cognitive Services for Voice Recognition
AZURE_VR_ENDPOINT="https://eastus.api.cognitive.microsoft.com/"
AZURE_VR_KEY="your_voice_recognition_key"

# Azure OpenAI Service
AZURE_OAI_ENDPOINT="https://octo-tree-ai.openai.azure.com/"
AZURE_OAI_KEY="your_openai_key"
AZURE_OAI_API_VERSION="2024-05-01-preview"
AZURE_OAI_DEPLOYMENT="gpt-35"

# Azure Computer Vision Services
AZURE_SA_ENDPOINT="https://octo-tree-cv.cognitiveservices.azure.com/"
AZURE_SA_KEY="your_computer_vision_key"

# Azure Personal Assistant Services
AZURE_PA_ENDPOINT="https://octo-tree-cv.cognitiveservices.azure.com/"
AZURE_PA_KEY="your_personal_assistant_key"

# Client configuration
CLIENT_URL="http://localhost:5173"
DOMAIN="asterkionline.com"

# Email configuration
EMAIL_SECURITY_HOST="smtp.gmail.com"
EMAIL_SECURITY_PORT=587
EMAIL_SECURITY_USER="your_email@gmail.com"
EMAIL_SECURITY_PASS="your_email_password"
```

### Steps


1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Prisma Setup**:

   - Migrate the database:

     ```bash
     npx prisma migrate dev --name init
     ```

   - Generate the Prisma client:

     ```bash
     npx prisma generate
     ```

3. **Run the Backend**:

   ```bash
   npm run dev
   ```

## Services

### Azure Services

- **Azure OpenAI**: Provides AI-driven capabilities using GPT-35 models.
- **Azure Computer Vision**: Analyzes solar panel images for damage detection.
- **Azure Cognitive Services**: Used for soil analysis and voice recognition.
- **Azure Storage**: Handles file storage for images and other files.

### Additional Services

- **Session Management**: Managed using Redis.
- **Emailer**: Configured to send notifications using Gmail SMTP.
- **Logger**: Logs important events such as sensor data changes, user interactions, and system errors.
- **Router**: Provides routing for the backend API.
- **Socket.IO**: Manages real-time WebSocket communication between the backend and the client.
- **Routine Management**: Handles automated tasks based on IoT sensor data.

## API Endpoints

Refer to router.ts for API usage.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or contributions, please reach out to the [Octo-Tree team](https://asterkionline.com).
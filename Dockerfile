# Base image using Node.js v22
FROM node:22

# Set the working directory to /app
WORKDIR /app

# Copy all the source code from both server and client
COPY server/ ./server
COPY client/ ./client

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Install client dependencies and build the client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Copy the client build (dist folder) into the server's correct location
WORKDIR /app/server
COPY client/dist ../../client/dist


# Add environment variables to the image (can also be passed at runtime)
ENV SESSION_SECRET="your_secret_key"
ENV REDIS_URL="redis://localhost:6379"
ENV AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=your_account_name;AccountKey=your_account_key;EndpointSuffix=core.windows.net"
ENV AZURE_VR_ENDPOINT="https://your_region.api.cognitive.microsoft.com/"
ENV AZURE_VR_KEY="your_vision_api_key"
ENV AZURE_OAI_ENDPOINT="https://your_openai_endpoint.openai.azure.com/"
ENV AZURE_OAI_KEY="your_openai_key"
ENV AZURE_SA_ENDPOINT="https://your_region.cognitiveservices.azure.com/"
ENV AZURE_SA_KEY="your_sentiment_analysis_key"
ENV AZURE_PA_ENDPOINT="https://your_region.cognitiveservices.azure.com/"
ENV AZURE_PA_KEY="your_personalizer_api_key"
ENV CLIENT_URL="http://localhost:5173"

# Expose port 3000 for the server
EXPOSE 3000

# Command to start the server
CMD ["npm", "run", "start"]

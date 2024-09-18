# Stage 1: Build the client
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy all the source code
COPY server/ ./server
COPY client/ ./client

# Install client dependencies and build the client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Stage 2: Create the final image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy the server source code
COPY server/ ./server

# Copy the client build from the previous stage
COPY --from=build /app/client/dist ./client/dist

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Expose port 3000
EXPOSE 3000

# Command to start the server
CMD ["npm", "run", "start"]

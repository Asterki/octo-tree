FROM node:18
WORKDIR /app

RUN git clone https://github.com/Asterki/api-database.git .

WORKDIR /app/client
RUN npm install
RUN npm run build

WORKDIR /app/server
RUN npm install
RUN npm run build

EXPOSE 5000

# Ejecuta el servidor
CMD ["npm", "run", "start"]

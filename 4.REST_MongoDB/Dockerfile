# Use an official Node runtime as the base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory /app in the container
COPY package*.json ./

# Install app dependencies in the container
RUN npm install

# Bundle app source inside the container
COPY . .

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Make port 80 available to the world outside this container
EXPOSE 3005

# Run the app when the container launches
CMD [ "npx", "ts-node", "server.ts" ]
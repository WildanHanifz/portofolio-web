# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend files
COPY server/package.json server/package-lock.json ./
COPY server ./server

# Install backend dependencies
RUN npm install --prefix ./server

# Copy frontend files
COPY package.json package-lock.json ./
COPY . .

# Build frontend
RUN npm install && npm run build

# Expose port (Fly.io will set $PORT)
EXPOSE 8080

# Start backend server (serving API)
CMD ["node", "server/server.js"]

# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build

# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build your app if you have a build step
RUN npm run build

# Expose the port your app listens on (adjust if different)
EXPOSE 3000

# Start your server
CMD ["node", "src/server.js"]

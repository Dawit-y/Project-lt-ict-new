# Stage 1: Build the React application
FROM node:16.20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the source code
COPY . .

# Add Node.js memory options to handle large builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 1234
EXPOSE 1234

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Use Node as the base
FROM node:16.20-alpine

# Update package index and install Nginx
RUN apk update && apk add --no-cache nginx

# Create and set working directory
WORKDIR /app

# Copy package.json and lock files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your source code (including .env, src, etc.) 
COPY . .

# Build the React/Vite app (outputs to /app/dist by default)
RUN npm run build

# Remove default Nginx assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to Nginx's default HTML directory
RUN cp -r dist/* /usr/share/nginx/html/

# (Optional) Copy custom Nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

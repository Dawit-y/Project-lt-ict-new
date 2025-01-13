FROM node:16.20-alpine

# 1) Update and install Nginx
RUN apk update && apk add --no-cache nginx

# Explicitly create necessary directories (if needed)
RUN mkdir -p /etc/nginx/conf.d /usr/share/nginx/html

# 2) Set working directory and build the React/Vite app
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of your source code (including .env, src, etc.)
COPY . .

# Build the React/Vite app (outputs to /app/dist)
RUN npm run build

# 3) Prepare the Nginx serving directory
RUN rm -rf /usr/share/nginx/html/*
RUN cp -r dist/* /usr/share/nginx/html/

# 4) Remove any existing Nginx configuration files
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

# 5) Copy your custom Nginx configuration as the main configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# 6) Copy your SSL certificate files into the image
# (Alternatively, you can mount these at runtime if security policies require.)
COPY certs_ssl/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY certs_ssl/privkey.pem /etc/ssl/private/privkey.pem

# 7) Expose SSL port (443) (and optionally port 80 for HTTP->HTTPS redirection)
EXPOSE 443
EXPOSE 80

# 8) Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

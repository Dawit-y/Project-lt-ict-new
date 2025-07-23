FROM node:16.20-alpine

# 1) Update and install Nginx
#RUN apk update && apk add --no-cache nginx
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.mirjamali.me/' /etc/apk/repositories \
    && apk update && apk add --no-cache nginx

# Explicitly create necessary directories (if needed)
RUN mkdir -p /etc/nginx/conf.d /usr/share/nginx/html

# 2) Create and set a working directory
WORKDIR /app

# 3) Copy package files first for better caching
COPY package*.json ./

RUN npm install --legacy-peer-deps
# Add this to increase memory
ENV NODE_OPTIONS=--max-old-space-size=4096

#  4) Copy the rest of your source code (including .env, src, etc.)
COPY . .

# 5) Build the React/Vite app (outputs to /app/dist)
RUN npm run build

# 6) Ensure Nginx HTML folder exists and remove default files
RUN rm -rf /usr/share/nginx/html/*

# 7) Copy your compiled output to the Nginx directory
RUN cp -r dist/* /usr/share/nginx/html/

# 8) Remove existing Nginx configuration files
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

# 9) Copy your custom Nginx configuration as the main configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# 10) Expose the port
EXPOSE 80

# 11) Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

FROM node:16.20-alpine

# 1) Update and install Nginx (this should create /usr/share/nginx/html)
RUN apk update && apk add --no-cache nginx

# 2) Create and set a working directory
WORKDIR /app

# 3) Copy package files first for better caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4) Copy the rest of your source code (including .env, src, etc.)
COPY . .

# 5) Build the React/Vite app (outputs to /app/dist)
RUN npm run build

# 6) Ensure Nginx HTML folder exists (should already exist, but just in case)
RUN mkdir -p /usr/share/nginx/html

# 7) Remove default Nginx assets
RUN rm -rf /usr/share/nginx/html/*

# 8) Copy your compiled output to the Nginx directory
RUN cp -r dist/* /usr/share/nginx/html/

# 9) (Optional) Copy custom Nginx config if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 10) Expose port 80
EXPOSE 1111

# 11) Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

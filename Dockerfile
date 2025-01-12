# -----------------------------
# Stage 1: Build the React app
# -----------------------------
FROM node:16.20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# -- FIXED: Copy your environment file from within the build context
#    so Vite can read it at build time.  We'll call it `.env` inside /app.
#COPY dev-frontend.env .env

# Copy the rest of the source code
COPY . .

# Add Node.js memory options to handle large builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application (Vite will see .env)
RUN npm run build

# -----------------------------
# Stage 2: Serve with Nginx
# -----------------------------
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (if you have one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 1111 (adjust if needed)
EXPOSE 1111

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

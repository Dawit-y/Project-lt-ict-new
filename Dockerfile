# Use the official Jenkins LTS image as the base
FROM jenkins/jenkins:lts
# Switch to root to perform installations
USER root
# --------------------------
# 1. Install System Dependencies
# --------------------------
RUN apt-get update && \
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        software-properties-common \
        supervisor \
        nginx \
        nodejs \
        npm && \
    rm -rf /var/lib/apt/lists/*
# --------------------------
# 2. Add Docker’s Official GPG Key
# --------------------------
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
# --------------------------
# 3. Set Up the Stable Docker Repository
# --------------------------
RUN add-apt-repository \
   "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
# --------------------------
# 4. Install Docker CE
# --------------------------
RUN apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io && \
    rm -rf /var/lib/apt/lists/*
# --------------------------
# 5. Install Docker Buildx
# --------------------------
ENV DOCKER_BUILDX_VERSION v0.10.3
RUN mkdir -p /usr/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/buildx/releases/download/${DOCKER_BUILDX_VERSION}/buildx-${DOCKER_BUILDX_VERSION}.linux-amd64 -o /usr/lib/docker/cli-plugins/docker-buildx && \
    chmod +x /usr/lib/docker/cli-plugins/docker-buildx
# Verify Buildx installation
RUN docker buildx version
# --------------------------
# 6. Configure Docker Group and Permissions
# --------------------------
# Replace 988 with your host's Docker group GID
ARG DOCKER_GID=988
RUN groupadd -for docker -g ${DOCKER_GID} && \
    usermod -aG docker jenkins
# --------------------------
# 7. Set Up Supervisor Configuration
# --------------------------
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# --------------------------
# 8. Set Up Nginx Configuration
# --------------------------
COPY nginx.conf /etc/nginx/nginx.conf
# --------------------------
# 9. Install Application Dependencies and Build
# --------------------------
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN rm -rf /usr/share/nginx/html/*
RUN cp -r dist/* /usr/share/nginx/html/
# --------------------------
# 10. Expose Ports
# --------------------------
EXPOSE 8080 50000 80
# --------------------------
# 11. Switch Back to Jenkins User
# --------------------------
USER jenkins
# --------------------------
# 12. Start Supervisor
# --------------------------
CMD ["/usr/bin/supervisord"]

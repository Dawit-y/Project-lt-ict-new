# Use the official Jenkins LTS image as the base
FROM jenkins/jenkins:lts

# Switch to root to install Docker
USER root

# Install Docker CLI and dependencies
RUN apt-get update && \
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg-agent \
        software-properties-common \
        lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository \
        "deb [arch=amd64] https://download.docker.com/linux/debian \
        $(lsb_release -cs) \
        stable" && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Install Docker Buildx
RUN mkdir -p /usr/lib/docker/cli-plugins && \
    curl -sSL https://github.com/docker/buildx/releases/latest/download/buildx-linux-amd64 -o /usr/lib/docker/cli-plugins/docker-buildx && \
    chmod +x /usr/lib/docker/cli-plugins/docker-buildx

# Verify Buildx installation
RUN docker buildx version

# Create docker group with the same GID as the host's docker group
ARG DOCKER_GID=988  # Replace 988 with your host's Docker GID
RUN groupadd -for -g ${DOCKER_GID} docker

# Add Jenkins user to docker group
RUN usermod -aG docker jenkins

# Set environment variable for Docker Buildx
ENV DOCKER_CLI_PLUGIN_DIR=/usr/lib/docker/cli-plugins

# Switch back to Jenkins user
USER jenkins

# (Optional) Install Docker Compose if needed
# RUN curl -L "https://github.com/docker/compose/releases/download/v2.17.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
#     chmod +x /usr/local/bin/docker-compose

# (Optional) Set working directory
# WORKDIR /var/jenkins_home

# (Optional) Expose necessary ports
# EXPOSE 8080 50000

# (Optional) Define entrypoint or command
# CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]

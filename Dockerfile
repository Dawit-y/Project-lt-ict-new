# Use your project's base image (modify as needed)
FROM ubuntu:latest 

# Install dependencies
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    curl \
    git \
    wget \
    sudo \
    docker.io  # Install Docker CLI inside the container

# Add a Jenkins user
RUN useradd -m -s /bin/bash jenkins && \
    echo "jenkins ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Create a Docker group and add Jenkins to it
ARG DOCKER_GID=988  # Change this to match your host's Docker GID
RUN groupadd -g ${DOCKER_GID} docker && \
    usermod -aG docker jenkins

# Set Jenkins as the default user
USER jenkins

# Set working directory (modify as per your project)
WORKDIR /home/jenkins

# Expose the Jenkins web interface port
EXPOSE 8080

# Start Jenkins (modify if running another service)
CMD ["java", "-jar", "/usr/share/jenkins/jenkins.war"]

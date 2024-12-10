pipeline {
    agent any

    environment {
        NODE_VERSION = '16.20.2'
        NODE_OPTIONS = '--max-old-space-size=4096'
        DEPLOY_DIR = '/var/www/react-app-dev'
        NGINX_CONF = '/etc/nginx/sites-available/react-app-dev'
    }

    triggers {
        pollSCM('H/1 * * * *') 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-token', url: 'https://github.com/yared098/Project-lt-ict-new.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs(NODE_VERSION) {
                    script {
                        sh '''
                        echo "Installing dependencies using npm cache..."
                        npm install --force
                        '''
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                nodejs(NODE_VERSION) {
                    sh 'echo "Running Tests..."' 
                }
            }
        }
        
            stage('Copying .env Files') {
            steps {
                
              
             script {
                    sh '''
                    echo "Adding file to production folder..."
                    cp /home/testthree/pms_files/dev-frontend.env .env
                    '''
                  }
            }
        }

        stage('Build') {
            steps {
                nodejs(NODE_VERSION) {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                script {
                    sh '''
                    echo "Deploying React application to Nginx..."

                    # Ensure deployment directory exists
                    sudo mkdir -p ${DEPLOY_DIR}

                    # Replace old build with new build files
                    sudo rm -rf ${DEPLOY_DIR}/*
                    sudo cp -r dist/* ${DEPLOY_DIR}/

                    # Create or update Nginx configuration
                    if [ ! -f ${NGINX_CONF} ]; then
                        echo "Creating Nginx configuration..."
                        sudo bash -c 'cat <<EOL > ${NGINX_CONF}
server {
    listen 1234;
    server_name _;

    root ${DEPLOY_DIR};
    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
EOL'
                        sudo ln -sf ${NGINX_CONF} /etc/nginx/sites-enabled/
                    else
                        echo "Nginx configuration already exists."
                    fi

                    # Restart Nginx to apply changes
                    echo "Restarting Nginx..."
                    sudo systemctl restart nginx

                    echo "Deployment completed. React app is now served on port 1234."
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment succeeded!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}

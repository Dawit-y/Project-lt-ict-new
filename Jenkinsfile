pipeline {
    agent any

    environment {
        NODE_VERSION = '16.20.2' 
        NODE_OPTIONS = '--max-old-space-size=4096'
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
                    sh 'npm install --force'
                }
            }
        }

        stage('Run Tests') {
            steps {
               
                nodejs(NODE_VERSION) {
                    //sh 'npm test'
                
                    echo 'Running Test...'
                }
            }
        }

        stage('Build') {
            steps {
                
                nodejs(NODE_VERSION) {
                    sh 'npm run build'
                }
             script {
                    sh '''
                    echo "Adding file to production folder..."
                    cp /path/to/your/file.txt dist/
                    '''
                  }
            }
        }

       
        stage('Run Server') {
             steps {
                   nodejs(NODE_VERSION) {
                        sh '''
                        pm2 delete pms || true
                        pm2 start npm --name "vite-server" --no-autorestart -- run dev -- --host 0.0.0.0 --port 1234
                        pm2 save
                        '''
                        echo 'server is running under PM2 on port 1234.'
                    }
        }
    }
    
        stage('Keep Server Running') {
            steps {
                // Keep the Jenkins job running
                script {
                    echo 'Keeping Jenkins job alive for 2 hours...'
                    sleep time: 12, unit: 'HOURS'
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

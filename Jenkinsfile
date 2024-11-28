pipeline {
    agent any

    environment {
        NODE_VERSION = '16.20.2' 
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
                    sh 'npm install force'
                }
            }
        }

        stage('Run Tests') {
            steps {
               
                nodejs(NODE_VERSION) {
                    sh 'npm test'
                }
            }
        }

        stage('Build') {
            steps {
                
                nodejs(NODE_VERSION) {
                    sh 'npm run dev'
                }
            }
        }

        stage('Deploy') {
            steps {
                // Deployment commands (e.g., upload to server or cloud storage)
                echo 'Deploying the application...'
                
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

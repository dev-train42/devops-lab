pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devops-nginx:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker rm -f devops-container || true
                docker run -d --name devops-container -p 8081:80 devops-nginx:${BUILD_NUMBER}
                docker image prune -f
                '''
            }
        }
    }
}
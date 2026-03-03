pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        environment {
            DOCKER_USER = "devtrain42"
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t $DOCKER_USER/devops-nginx:${BUILD_NUMBER} .
                """
            }
        }

        stage('Push Image') {
            steps {
                sh """
                docker push $DOCKER_USER/devops-nginx:${BUILD_NUMBER}
                """
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
pipeline {
    agent any

    environment {
        DOCKER_USER = "devtrain42"
        IMAGE_NAME = "devops-nginx"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_USER/$IMAGE_NAME:${BUILD_NUMBER}'
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                sh 'docker push $DOCKER_USER/$IMAGE_NAME:${BUILD_NUMBER}'
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                docker rm -f devops-container || true
                docker run -d --name devops-container -p 8081:80 \
                $DOCKER_USER/$IMAGE_NAME:${BUILD_NUMBER}
                """
            }
        }

        stage('Cleanup Dangling Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}
pipeline {
    agent any

    environment {
        DOCKER_USER = "devtrain42"
        FRONTEND_IMAGE = "devops-nginx"
        BACKEND_IMAGE = "devops-api"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $DOCKER_USER/$FRONTEND_IMAGE:${BUILD_NUMBER} .'
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $DOCKER_USER/$FRONTEND_IMAGE:${BUILD_NUMBER}'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('devops-api') {
                    sh 'docker build -t $DOCKER_USER/$BACKEND_IMAGE:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push $DOCKER_USER/$BACKEND_IMAGE:${BUILD_NUMBER}'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    try {

                        sh """
                        kubectl set image deployment/devops-nginx-deployment \
                        devops-nginx=$DOCKER_USER/$FRONTEND_IMAGE:${BUILD_NUMBER}

                        kubectl set image deployment/devops-api-deployment \
                        devops-api=$DOCKER_USER/$BACKEND_IMAGE:${BUILD_NUMBER}

                        kubectl annotate deployment/devops-nginx-deployment \
                        kubernetes.io/change-cause="Frontend version ${BUILD_NUMBER}" --overwrite

                        kubectl annotate deployment/devops-api-deployment \
                        kubernetes.io/change-cause="Backend version ${BUILD_NUMBER}" --overwrite

                        kubectl rollout status deployment/devops-nginx-deployment --timeout=60s
                        kubectl rollout status deployment/devops-api-deployment --timeout=60s
                        """

                    } catch (err) {

                        sh """
                        kubectl rollout undo deployment/devops-api-deployment
                        kubectl rollout undo deployment/devops-nginx-deployment
                        """

                        error("Deployment failed. Rolled back automatically.")
                    }
                }
            }
        }

        stage('Verify Rollout') {
            steps {
                sh """
                kubectl rollout status deployment/devops-nginx-deployment
                kubectl rollout status deployment/devops-api-deployment
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
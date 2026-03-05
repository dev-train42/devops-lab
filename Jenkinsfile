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
                deleteDir()
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                sh 'docker build -t $DOCKER_USER/$FRONTEND_IMAGE:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $DOCKER_USER/$FRONTEND_IMAGE:${BUILD_NUMBER}'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
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
                        echo "Updating frontend image..."
                        kubectl set image deployment/devops-nginx-deployment \
                        devops-nginx=$DOCKER_USER/$FRONTEND_IMAGE:${BUILD_NUMBER}

                        echo "Updating backend image..."
                        kubectl set image deployment/devops-api-deployment \
                        devops-api=$DOCKER_USER/$BACKEND_IMAGE:${BUILD_NUMBER}

                        echo "Adding deployment annotations..."
                        kubectl annotate deployment/devops-nginx-deployment \
                        kubernetes.io/change-cause="Frontend version ${BUILD_NUMBER}" --overwrite

                        kubectl annotate deployment/devops-api-deployment \
                        kubernetes.io/change-cause="Backend version ${BUILD_NUMBER}" --overwrite

                        echo "Waiting for rollout..."
                        kubectl rollout status deployment/devops-nginx-deployment --timeout=120s
                        kubectl rollout status deployment/devops-api-deployment --timeout=120s
                        """

                    } catch (err) {

                        echo "Deployment failed. Rolling back..."

                        sh """
                        kubectl rollout undo deployment/devops-api-deployment
                        kubectl rollout undo deployment/devops-nginx-deployment
                        """

                        error("Deployment failed and rolled back.")
                    }
                }
            }
        }

        stage('Debug Pods') {
            steps {
                sh """
                echo "Pods status:"
                kubectl get pods -o wide

                echo "Services:"
                kubectl get svc

                echo "Ingress:"
                kubectl get ingress
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
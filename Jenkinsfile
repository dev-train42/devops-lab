pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Build stage'
                sh 'ls -l app'
            }
        }

        stage('Test') {
            steps {
                echo 'Test stage'
                sh 'cat app/index.html'
            }
        }
    }
}
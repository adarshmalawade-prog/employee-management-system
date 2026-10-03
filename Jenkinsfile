pipeline {
    agent any

    environment {
        // Enforce consistent Docker Compose project name across pipeline runs
        COMPOSE_PROJECT_NAME = 'employee-management-system'
    }

    stages {
        // -------------------------------------------------------------
        // Stage 1: Checkout SCM
        // Pulls the latest source code from the configured repository
        // -------------------------------------------------------------
        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        // -------------------------------------------------------------
        // Stage 2: Install Dependencies
        // Installs exact dependencies for both backend and frontend using npm ci
        // -------------------------------------------------------------
        stage('Install Dependencies') {
            steps {
                echo 'Installing backend dependencies...'
                dir('backend') {
                    sh 'npm ci'
                }

                echo 'Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 3: Backend Tests
        // Executes automated Jest/Supertest suite; fails pipeline if tests fail
        // -------------------------------------------------------------
        stage('Backend Tests') {
            steps {
                echo 'Running backend automated test suite (Jest + Supertest)...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 4: Frontend Build
        // Validates TypeScript types and generates production Vite bundle
        // -------------------------------------------------------------
        stage('Frontend Build') {
            steps {
                echo 'Building frontend production bundle (TypeScript + Vite)...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 5: Docker Build
        // Builds production multi-stage Docker images for backend and frontend
        // -------------------------------------------------------------
        stage('Docker Build') {
            steps {
                echo 'Building Docker images for backend and frontend services...'
                sh 'docker compose -p ${COMPOSE_PROJECT_NAME} build backend frontend'
            }
        }

        // -------------------------------------------------------------
        // Stage 6: Deploy
        // Starts/updates containers in detached mode while preserving DB volume
        // -------------------------------------------------------------
        stage('Deploy') {
            steps {
                echo 'Deploying containers with Docker Compose...'
                sh 'docker compose -p ${COMPOSE_PROJECT_NAME} up -d'
            }
        }

        // -------------------------------------------------------------
        // Stage 7: Health Check
        // Polls container health status until all services report healthy
        // -------------------------------------------------------------
        stage('Health Check') {
            steps {
                echo 'Verifying container health status...'
                timeout(time: 2, unit: 'MINUTES') {
                    sh '''
                        echo "Waiting for containers to report healthy status..."
                        
                        # Loop for up to 60 seconds checking container health
                        for i in $(seq 1 12); do
                            POSTGRES_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' ems-postgres 2>/dev/null || echo '"unknown"')
                            BACKEND_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' ems-backend 2>/dev/null || echo '"unknown"')
                            FRONTEND_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' ems-frontend 2>/dev/null || echo '"unknown"')

                            echo "Attempt $i: Postgres=$POSTGRES_STATUS | Backend=$BACKEND_STATUS | Frontend=$FRONTEND_STATUS"

                            if [ "$POSTGRES_STATUS" = '"healthy"' ] && [ "$BACKEND_STATUS" = '"healthy"' ] && [ "$FRONTEND_STATUS" = '"healthy"' ]; then
                                echo "[OK] All services (Postgres, Backend, Frontend) are healthy!"
                                exit 0
                            fi

                            sleep 5
                        done

                        echo "[ERROR] Timed out waiting for containers to become healthy."
                        docker compose -p ${COMPOSE_PROJECT_NAME} ps
                        exit 1
                    '''
                }
            }
        }

        // -------------------------------------------------------------
        // Stage 8: Smoke Test
        // Performs HTTP verification against backend API and frontend
        // -------------------------------------------------------------
        stage('Smoke Test') {
            steps {
                echo 'Executing live HTTP smoke tests...'
                sh '''
                    # Test 1: Direct backend health check endpoint
                    echo "Checking Backend Health endpoint (/api/health)..."
                    curl -sf http://localhost:5000/api/health > /dev/null || {
                        echo "[ERROR] Backend health check endpoint failed!"
                        exit 1
                    }
                    echo "[OK] Backend API is responding and healthy."

                    # Test 2: Frontend static page reachable through Nginx
                    echo "Checking Frontend web server endpoint (/)..."
                    curl -sf http://localhost:3000/ > /dev/null || {
                        echo "[ERROR] Frontend web server is not reachable!"
                        exit 1
                    }
                    echo "[OK] Frontend web server is responding."

                    # Test 3: Reverse proxy route through Frontend Nginx
                    echo "Checking Nginx reverse proxy endpoint (/api/health)..."
                    curl -sf http://localhost:3000/api/health > /dev/null || {
                        echo "[ERROR] Nginx reverse proxy to backend failed!"
                        exit 1
                    }
                    echo "[OK] Nginx reverse proxy to API is working."
                '''
            }
        }
    }

    // -----------------------------------------------------------------
    // Post Actions
    // Notifications and summary feedback on pipeline completion
    // -----------------------------------------------------------------
    post {
        always {
            echo 'Pipeline execution finished.'
            sh 'docker compose -p ${COMPOSE_PROJECT_NAME} ps'
        }
        success {
            echo 'SUCCESS: CI/CD Pipeline completed successfully! All checks passed and application is live.'
        }
        failure {
            echo 'FAILURE: CI/CD Pipeline failed! Review stage logs above to troubleshoot the issue.'
        }
    }
}

- Download the zip file

# Setup development environment
    - Installed node version 20
    
    - For system wide availability of yarn
      npm install -g  yarn
    
    - setup docker environment

# Started work on codebase
    
    - unzipped the zip file
    
    - pushed the local repository to github
    
    - To install project specific dependencies
      yarn install
    
    - For generating database schema
      yarn db:generate ( rename db:migrate to db:generate in package.json file)
    
    - prepared .env and .env.test file using the .env.example
    
    - Compiling and bundling source code
      yarn build
    
    - npm init @eslint/config - set up eslint configuration
      
      
      Need to install the following packages:
      @eslint/create-config@1.1.5
      Ok to proceed? (y) y
      @eslint/create-config: v1.1.5

√ How would you like to use ESLint? · problems    
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · typescript
√ Where does your code run? · browser
The config that you've selected requires the following dependencies:

eslint@9.x, globals, @eslint/js, typescript-eslint
√ Would you like to install them now? · No / ( Yes ) 
√ Which package manager do you want to use? · yarn


# Created docker file
    
    - base image node:20-alpine (light weight base docker image)
    
    - To optimize Docker image building process -> multi stage dockerfile
    
    - yarn install - - production (install only necessary dependencies)


# Created docker-compose-test file 

- for running postgresql container

- To ensure code quality and correctness 
  yarn lint and yarn test

- Github workflow:
    
    - ci.yaml (lint and test run, docker image build and pushed to dockerhub, CICD)
    
    - setup github secrets (environment variables)

# Server Setup
- SSH into Server
- Update and upgrade server 
    ```
    sudo apt update && sudo apt upgrade -y
    ```
 
- Change Owner of `/home/sunandan`:
    ```
    cd /home
    sudo chown -R $USER:$GROUP sunandan
    ```
- Install Docker following official docker guides:
 
- Create Docker Swarm:
    ```
    docker swarm init
    ```
- Make projects Directory:
    ```
    cd; mkdir projects; cd projects
    ```
- Create docker-stack.yaml file:
    ```
    services:
    db:
        image: postgres:14
        deploy:
        replicas: 1
        placement:
            constraints: [node.role == manager]
        restart_policy:
            condition: on-failure
        ports:
        - 5432:5432
        environment:
        POSTGRES_PASSWORD: '1234'
        POSTGRES_USER: 'postgres'
        POSTGRES_DB: 'events'
 
    app:
        image: geesunandan/sample-node:$IMAGE_TAG
        deploy:
        replicas: 4
        placement:
            constraints: [node.role == manager]
        restart_policy:
            condition: on-failure
        depends_on:
        - db
        ports:
        - 5555:3000
    ```
 
- Deploy stack:
    ```
    docker stack deploy -c docker-stack.yaml mystack
    ```
 
- Verify deployment:
    ```
    docker stack ls
    docker stack services mystack
    ```
 
- Increase Replica to `6`:
    ```
    docker services update --replicas 6 mystack_app
    ```
 
- Verify Rollback:
    ```
    docker services rollback mystack_app
    ```
 
# Append `name: Update Docker Stack` action in `ci.yaml`:
- ci.yaml:
    ```
    - name: Update Docker Stack
    uses: appleboy/ssh-action@v0.1.3
    with:
      host: ${{ secrets.SSH_HOST }}
      username: ${{ secrets.SSH_USER }}
      key: ${{ secrets.SSH_PRIVATE_KEY }}
      script: |
        export IMAGE_TAG=${{ env.PACKAGE_VERSION }}
        docker stack deploy -c /home/sunandan/projects/docker-stack.yaml mystack
    ```
 
# Create Rollback Action:
- rollback.yaml:
- Manually trigger rollback pipeline in github action to get application into previous state.
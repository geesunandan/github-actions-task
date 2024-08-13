

This is a simple Node application using postgres database. There are several unit test and integration tests under these repositories.

Here are few requirements that I have to setup for the deployment of this application.

> [!Note]
> If you cannot meet all the specification that is OK but please submit the assignment with your genuine approaches

- Github Actions must be used for the pipelines.
- Make sure to add .env file and .env.test for test environment for postgres connection. Refer .env.example 
- There must be a CI pipeline for lint, test and build (Command are in package.json) (Better if you check the docker build)
- There must be a Continuous Delivery where the release to main branch would tag the version and make a release on Github (Can use external actions)
- There must be at least deployment pipeline (not necessarily continuous) where the version can be rolled back to previous deployment
- Deployment must be done on a EC2 instance. (Credentials will be provided to you)
- Document all of your decisions in a DeploymentManual.md and push it to Github.
- Make Pull Request for each pipeline and merge it with proper commit messages
- If you want to go extra mile Add (makefile or bashfile) for local development and test. The script should start database and start local environment
    - For example: `bash start` should run the database instance start local application and `bash test` should setup the databse and run the test (Hint: One of solution can be leveraging docker compose)

If you have any questions please feel free to reach us.

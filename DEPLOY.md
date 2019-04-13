
# Heroku deployment:
* If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.
  `$ heroku login`
* Log in to Container Registry. You must have Docker set up locally to continue. You should see output when you run this command.
  `$ docker ps`
* Now you can sign into Container Registry.
  `$ heroku container:login`
* Deploy your Docker-based app. Build the Dockerfile in the current directory and push the Docker image to deploy the app.
   1. Build the docker image: `$ cd server && docker build -t jared-backend .`
   2. Push the image to heroku: `$ heroku container:push web -a jared-backend`
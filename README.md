# README #

Jared Back-End installation steps

### How to install: ###
* [Install NodeJS (If not already installed)](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* Clone the Jared Back-End git repository
* $ npm install
* `sudo apt-get update`
* Set up docker repository:

    `sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common`

* Add Docker’s official GPG key:
     `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

* Install Docker:

    `sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"`

* sudo apt-get update
* sudo apt-get install docker-ce
* Test: sudo docker run hello-world
* Go to jared backend folder and run “npm run docker-up”

* To work with the automatic update of your changes, you must change the execution script in package.json, replace "node app.js" for "nodemon app.js"

# Git workflow #
1. Update to the latest version of master - `$ git checkout master && git pull`
2. Create a new branch for working on the issue
  2.1 `$ git checkout -b features/<branch-name>` (If it's a new feature)
  2.2 `$ git checkout -b bug_fixing/<branch-name>` (If it's a bug)
3. Commit locally as you need - `$ git commit -m 'bla bla'`
4. Update your branch against master - `$ git fetch origin && git rebase origin master`
5. Push your branch to github - `$ git push origin <branch-name>`
6. Create a Pull request and assign a reviewer

Heroku deployment:
* If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.
  `$ heroku login`
* Log in to Container Registry. You must have Docker set up locally to continue. You should see output when you run this command.
  `$ docker ps`
* Now you can sign into Container Registry.
  `$ heroku container:login`
* Deploy your Docker-based app. Build the Dockerfile in the current directory and push the Docker image to deploy the app.
  `$ heroku container:push web`

Jared API Endpoints:
* POST https://jared-backend.herokuapp.com/api/user
  Request:
  ```javascript
  {
    "username": "cuti",
    "email": "cuti@mail.com",
    "password": "cuti"
  }
  ```
  Response:
  ```javascript
  {
    "status": 200,
    "errorInfo": "",
    "data": {
        "message": "User created!"
    }
  }
  ```
  * POST https://jared-backend.herokuapp.com/api/login
    Request:
    ```javascript
    {
      "email": "cuti@mail.com",
      "password": "cuti"
    }
    ```
    Response:
    ```javascript
    {
      "status": 200,
      "errorInfo": "",
      "data": {
          "message": "Login correct!"
      }
    }
    ```
* GET https://jared-backend.herokuapp.com/api/user?email=cuti@mail.com
  ```javascript
    {
        "status": 200,
        "errorInfo": "",
        "data": [
            {
                "_id": "5a8436b7a1af260010767191",
                "email": "cuti@mail.com",
                "username": "cuti",
                "active": true,
                "__v": 0,
                "clients": [],
                "relation": "hired"
            }
        ]
    }
  ```
* GET https://jared-backend.herokuapp.com/api/user/cuti
    ```javascript
    {
  "status": 200,
  "errorInfo": "",
  "data": {
      "_id": "5a8436b7a1af260010767191",
      "email": "cuti@mail.com",
      "username": "cuti",
      "active": true,
      "__v": 0,
      "clients": [],
      "relation": "hired"
  }
}
    ```
* GET https://jared-backend.herokuapp.com/api/users
        ```javascript
        {
    "status": 200,
    "errorInfo": "",
    "data": [
        {
            "_id": "5a68b6516dc9920010b16229",
            "email": "alexis@test.com2",
            "username": "alexisrcausa2",
            "active": true,
            "__v": 0,
            "clients": [],
            "relation": "hired"
        },
        {
            "_id": "5a8436b7a1af260010767191",
            "email": "cuti@mail.com",
            "username": "cuti",
            "active": true,
            "__v": 0,
            "clients": [],
            "relation": "hired"
        }
    ]
}
        ```
* DELETE https://jared-backend.herokuapp.com/api/user
```javascript
req =  {
	"id": "5a8436b7a1af260010767191",
 }

{
    "status": 200,
    "errorInfo": "",
    "data": {
        "message": "User deleted!"
    }
}
```
* PUT https://jared-backend.herokuapp.com/api/user
```javascript
req =  {
	"id": "5a8436b7a1af260010767191",
    "username": "aarias"
 }
resp =
{
    "status": 200,
    "errorInfo": "",
    "data": {
        "message": "User updated!"
    }
}
```

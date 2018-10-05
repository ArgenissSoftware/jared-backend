# README #
The Jared Project:
Jared is an ERP system for handling employees, customers other ERP features related with software companies.

Jared Back-End installation steps

### How to install: ###
* [Install Docker (If not already installed)](https://www.docker.com/get-started)
* Clone the Jared Back-End git repository (fork the repository first if you want to contribute)
* Build and run the docker containers: 
  `docker-compose up -d`

# Git workflow #
1. Update to the latest version of master - `$ git checkout master && git pull`
2. Create a new branch for working on the issue
  2.1 `$ git checkout -b features/<#issue_number>-<name>` (If it's a new feature)
  2.2 `$ git checkout -b bug_fixing/<#issue_number>-<name>` (If it's a bug)
3. Commit locally as you need - `$ git commit -m 'bla bla'`
4. Update your branch against master - `$ git fetch origin && git rebase origin master`
5. Push your branch to github - `$ git push origin <branch-name>`
6. Create a Pull request and assign a reviewer

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


### New API endpoints documentation:

https://documenter.getpostman.com/view/5206471/RWgnWzdE

### API endpoint remote url:

- [Jared Backend] (https://jared-backend.herokuapp.com)

Jared API Endpoints:
* POST https://jared-backend.herokuapp.com/api/users
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
  * POST https://jared-backend.herokuapp.com/auth/login
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
* GET https://jared-backend.herokuapp.com/api/users/email/cuti@mail.com
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
* GET https://jared-backend.herokuapp.com/api/users/username/cuti
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
* DELETE https://jared-backend.herokuapp.com/api/users/disable/5a8436b7a1af260010767191
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
* PUT https://jared-backend.herokuapp.com/api/users/5a8436b7a1af260010767191
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

# README #
The Jared Project:
Jared is an ERP system for handling employees, customers other ERP features related with software companies.

Jared Back-End installation steps

### How to install: ###
* [Install Docker (If not already installed)](https://www.docker.com/get-started)
* Clone the Jared Back-End git repository (fork the repository first if you want to contribute)
* Build and run the docker containers:

  `docker-compose up -d`

# Run Database Migrations #
1. Once the containers are running:

   `docker-compose exec server sh -c "cd src/migration; node migrate.js"`

# Git workflow #
1. Update to the latest version of master - `$ git checkout master && git pull`
2. Create a new branch for working on the issue
  2.1 `$ git checkout -b features/<#issue_number>-<name>` (If it's a new feature)
  2.2 `$ git checkout -b bug_fixing/<#issue_number>-<name>` (If it's a bug)
3. Commit locally as you need - `$ git commit -m 'bla bla'`
4. Update your branch against master - `$ git fetch origin && git rebase origin master`
5. Push your branch to github - `$ git push origin <branch-name>`
6. Create a Pull request and assign a reviewer



### New API endpoints documentation:

https://documenter.getpostman.com/view/5206471/RWgnWzdE


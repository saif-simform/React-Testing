# REST API Node Server

Application backend is developed using `Node.js` framework with `mongoDB` database.

## Description

1. install node js from [https://nodejs.org/en/download/]

## Getting Started

## Steps follow to run application in your system

1. First clone the repo from github usign following `command`
   `https://github.com/saif-simform/React-Testing.git`
2. Then go to the `backend` folder which consist backend code.

### Installation

Install the dependencies:

```bash

npm install
```

### Import database

You will find a DB folder in the home directory which contain `test_db` database.

import `test_db` database into your system using following command.

`mongorestore --db=test_db <--path-->`

Note: `path` could be /home/ubuntu/project/React-Testing/backend/DB

### Create .env File

Set the environment variables:

You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. Fill in the variables to fit your application

### Commands

Run:

```bash
npm start
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--app.js          # Express app & App entry point
```

## To create admin user run seeder file

# First go to seeder folder then run following Command

node admin.js

## Admin Login

email: admin@design.com,
password: 123123,

## User Login

1. email: saifuddin@simformsolutions.com, password: 123123

2. email: san@gmail.com, password: 123123

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Application frontend is developed using `React.js` framework with `reactstrap` designing library.

## Steps follow to run application in your system

1. First clone the repo from github usign following `command`
   `git clone https://github.com/saif-simform/React-Testing.git`
2. Then go to the `frontend` folder which consist frontend code.
3. Then install `node_modules` using following `command`
   `npm install`

### Create .env File

Set the environment variables:

You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. Fill in the variables to fit your application

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

### Login with different creds:

## Admin Login

email: admin@design.com,
password: 123123,

## User Login

1. email: saifuddin@simformsolutions.com, password: 123123

2. email: san@gmail.com, password: 123123

### `npm test`

# To run test cases

1. To run all frontend test cases use `npm test`
2. To run a specific test file use `npm test relative_path (Note: Replace relative_path  with your test file path)`
3. For test coverage of a single test file
    
    `npm test **relative_path** -- --coverage --detectOpenHandles`

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

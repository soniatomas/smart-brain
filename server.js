/*
CREATED ENDPOINTS

/ --> GET => success status
/signin --> POST => user/fail status
/register --> POST => user
/profile/:userId --> GET => user
/image --> PUT => value

*/

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

// connecting to our postgresdb
// the ip 127.0.0.1 is localhost
const database = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});

const app = express();

// adding body-parser middleware so we can read user responses
app.use(bodyParser.json());
app.use(cors())


// Homepage route
// returns the database of users
app.get('/', (req, res) => {
	res.status(200).json();
})

// sign in route
// requires email and password values in body of request
// returns user if found in database, 
// returns 400 status error if user not found
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, database, bcrypt) } )

// register route
// requires email, name, password values in request body
// creates new user and saves user into database
// returns newly create user
// right here we are doing dependency injection: 
// we are injecting whatever dependency the handleRegister function needs
app.post('/register', (req, res) => { register.handleRegister(req, res, database, bcrypt) } )

// profile/:id route
// requires an id value in url address (localhost:3000/profile/123)
// returns user matching id value
// return 404 status if user not found
app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, database) } )

// clarifai api endpoint
app.post('/callclarifaiapi', (req, res) => { image.handleClarifaiApiCall(req, res) } )


// image route
// requires id value in body of request
// finds user matching id and increments their entries value
// returns the number of entries the user has
// returns 404 error is user is not found
app.put('/image', (req, res) => { image.handleIncrementEntries(req, res, database) } )

// Chanching the code below for deployment.
// Listening to port number provided by environmental variables.

// app.listen(3002, () => {
app.listen(process.env.PORT, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

/*
// hardcoded simple test database
const db = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@email.com',
			password: 'hi',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@email.com',
			password: 'hi',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '123',
			hash: '$2a$10$ztzwIF34hz9d6SVklpkKf.a0IuByMqmfNkeXUlbd82cjOkcF1Ks2q',
			email: 'john@email.com'
		},
		{
			id: '124',
			hash: '$2a$10$U9pNiwy4TxmkCzcWstmsTeHXmUHuu0NSNBuAnhC7okYicEh55E8SO',
			email: 'sally@email.com'
		}
	]
}
*/
const handleSignIn = (req, res, database, bcrypt) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json('invalid email, name, or password');
	}
	else {
		// query to login table to check if inputed email and password
		// match a set of valid credentials
		database.select('email', 'hash').from('login')
			.where('email', '=', email)
			.then(data => {
				const isCorrectPass = bcrypt.compareSync(password, data[0].hash);
				// if the credentials are valid, then we query the users table
				// to return a user. 
				if (isCorrectPass) {
					return database.select('*').from('users')
					.where('email', '=', email)
					.then(results => {
						const user = results[0];
						res.json(user);
					})
					.catch(err => res.status(400).json('error signing in'));
				}
				else {
					res.status(400).json('error signing in');
				}
			})
			.catch(err => res.status(400).json('error signing in'));
	}
}

module.exports = {
	handleSignIn : handleSignIn
}
const handleRegister = (req, res, database, bcrypt) => {
	const { email, name, password } = req.body;

	if (!email || !name || !password) {
		res.status(400).json('invalid email, name, or password');
	}
	else {
		// creating a hash of the inputed password.
		const passwordHash = bcrypt.hashSync(password);

		// wrapping functionality to store user and password into 
		// the database into a transaction,
		// I am using a transaction so that if the issue ever arises where
		// I cannot store new user into the database, the job to store 
		// the new users password also fails.

		database.transaction(trx => {
			trx.insert({
				hash: passwordHash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: email,
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0])
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'));
		}
}

module.exports = {
	handleRegister: handleRegister
}
const handleGetProfile = (req, res, database) =>  {
	const { id } = req.params;
	let found = false;
	database.select('*').from('users').where({id})
		.then(results => {
			let user = results[0];
			// if a user was found with this id, then return that user
			if (user.id) {
				res.json(user);
			}
			// else return a message saying user was not found. 
			else {
				res.status(404).json('user not found');
			}
		 })
		.catch(err => res.status(404).json('user not found'));
}

module.exports = {
	handleGetProfile : handleGetProfile
}
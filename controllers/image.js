//import fetch from 'node-fetch';
const fetch = require('node-fetch');

// Setting up default values for Clarifai API
const USER_ID = 'sonia';
const PAT = 'ceaed8e074c140a9b423c50a4255641f';
const APP_ID = 'my-first-application';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';

const handleClarifaiApiCall = (req, res) => {
	const { imageUrl } = req.body;
	
	// Create the JSON object to send to the API
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    /*
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    */
    
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.text())
    .then(result => {
        const resultObject = JSON.parse(result);
        res.json(resultObject);
    })
    .catch(err => res.status(400).json('unable to work with Clarifai API'));
}

const handleIncrementEntries = (req, res, database) => {
	const { id } = req.body;
	// quering the users from database, incrementing their
	// entries value, and returning the updated number of 
	// entries
	database('users')
	.where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => 
		res.json((entries[0].entries)))
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleIncrementEntries : handleIncrementEntries,
	handleClarifaiApiCall : handleClarifaiApiCall
}


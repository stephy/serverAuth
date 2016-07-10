const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({
		sub: user.id, //subject, who does this subject belongs to
		iat: timestamp //(iat) issued at time
	}, config.secret);
}

exports.signin = function(req, res,next) {
	//User has already had their email and password auth'd
	//we just need to give them a token
	res.send({ token: tokenForUser(req.user)});
}
//req: http request
//res: represents the response we will send back
//next: error handling
exports.signup = function(req, res, next) {
	const email  = req.body.email;
	const password = req.body.password;

	if (!email || !password ){
		return res.status(422).send({
			error: 'You must provide email and password'
		});
	}
	//see if a user if a given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) { return next(err); }

		//if user with email exists, return email
		if (existingUser) {
			return res.status(422).send({ error: 'Email in use'});
		}

		//if user with email does not exist. create and save user record
		const user = new User({
			email: email,
			password: password
		});

		user.save(function(err) {
			if (err) { return next(err); }
			//respond to request indicating the user was created
			//send TOKEN 
			//JWT JSON Web Token
			// User ID + Secret String = JSON Web Token
			res.json({ token: tokenForUser(user)});
		});

	});

	
}
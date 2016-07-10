const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

/*
	Authentication flows
	3 use cases
	
	1. Signing up -> verify email is not in use -> token

	2. Signing in -> verify email and password -> token
	(using local strategy)

	3. Auth'd Request -> verify token -> resource access
	(verify token using jwt strategy)

*/

//attempt to authenticate an user with just an email and password
//create local strategy
const localOptions = { usernameField : 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	//verify this email and password
	//call done with the user if it is the correct email and password
	//otherwise call done with false

	//find user and compare passwords
	User.findOne({email: email}, function(err, user) {
		if (err) { return done(err); }

		//user thinks he has an account but doesnt
		//user not found
		if (!user) { return done(null, false); }

		//compare passwords  - is 'password' equal to user.password?
		//decode bcrypted password
		console.log(user);
		user.comparePassword(password, function(err, isMatch) {
			if(err) {return done(err);}
			if(!isMatch) {return done(null, false);}

			return done(null, user);
		})
	});
});
//set up options for JWT strategy
const jwtOptions =  {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

//create JWT strategy
//name of strategy is jwtLogin
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	//payload is the jwt token (sub property)
	//done callback function we need to call if we successfully authenticated the user


	// See if the user ID in the payload exist in our database
	// If it does, call 'done' with that user
	// otherwise, call done without a user object

	User.findById(payload.sub, function(err, user) {
		//search failed to occur
		if (err) { return done(err, false); }

		if (user) {
			done(null, user);
		} else {
			// search didn't fail but didn't find the user
			// this person is not authenticated
			done(null, false);
		}
	});
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
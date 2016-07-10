//local definition what a user is so we can tell mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//define our model
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true},
	password: String
});

//on save Hook, encrypt password
//Before saving a model, run this function
userSchema.pre('save', function(next){
	//get access to the user model
	const user = this;

	/*
	1.Saving a password
	salt + plain password = salt + hashed password

	2.Comparing a password (Sign in)
	(salt + hashed password) is the password saved in the db
	salt + submitted password = hashed password
	if (salt + hashed password) === hashed password) then user is authenticated

	*/

	//generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt){
		if (err) { return next(err); }

		//hash (encrypt) our password using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err); }

			// overwrite plain text password with encrypted password
			user.password = hash;
			next();

		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return callback(err); }
		callback(null, isMatch);
	});
}

//create model class
const ModelClass = mongoose.model('user', userSchema);

//export the model so other files can make use of it
module.exports = ModelClass;
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
// below when using session = false, it is so passport doesn't create cookies
const requireAuth = passport.authenticate('jwt',{ session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
	app.get('/', requireAuth, function(req, res){
		res.send({ message: 'super secret code is ABX'}); 
	});

	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
}
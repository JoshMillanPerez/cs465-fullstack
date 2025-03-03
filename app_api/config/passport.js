const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user'); // Match 'users' from user.js

passport.use(new LocalStrategy({
    usernameField: 'email'
},
async (email, password, done) => {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
const passport = require('passport');
const mongoose = require('mongoose');
require('../models/user'); // Registers 'users'
const User = mongoose.model('user'); // Use 'users' as registered

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ "message": "All fields required" });
    }

    try {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        await user.save();
        const token = user.generateJwt();
        console.log('Registration successful, token:', token);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(400).json({ "message": "Registration failed", "error": err.message });
    }
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ "message": "All fields required" });
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ "message": "Server error", "error": err.message });
        }
        if (user) {
            const token = user.generateJwt();
            console.log('Login successful, token:', token);
            return res.status(200).json({ token });
        } else {
            console.log('Login failed:', info);
            return res.status(401).json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};
//write auth routes here
const routes = require('express').Router();
const User = require('../models/user');
const Post = require('../models/post');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

routes.get('/', (req, res) => {
    res.send('User route');
});

// @route POST api/users/register
// @desc Register user
// @access Public
routes.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });}
    try {
        // check for existing user
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        //All good
        const hashedpassword = await argon2.hash(password);
        const newUser = new User({
            name,
            email,
            password: hashedpassword
        });
        await newUser.save();
        //return token
        const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: 'User created' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
});

// @route POST api/users/login
// @desc Login user
// @access Public
routes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ success: false, msg: 'Please enter all fields' });
    }
    try {
        // check for existing user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'User does not exist' });
        }
        //All good
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        //return token
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: 'User logged in successfully', accessToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = routes;
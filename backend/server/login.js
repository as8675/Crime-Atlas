const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phoneNumber: String,
    password: String
});

const User = mongoose.model('Users', UserSchema);

router.post('/register', async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phoneNumber, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error registering new user.");
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");

        const token = jwt.sign(
            { email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during login");
    }
});

module.exports = router;

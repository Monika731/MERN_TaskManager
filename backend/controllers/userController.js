const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,  // Save hashed password
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`🔍 Login Attempt: Email - ${email}`);

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found with email: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`✅ User Found: ${user.email}`);
        console.log(`🔑 Stored Hashed Password: ${user.password}`);
        console.log(`🔍 Comparing with Entered Password: ${password}`);

        // Compare the entered password with hashed password in DB
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log(`🚨 bcrypt Error: ${err.message}`);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            console.log(`🔍 bcrypt.compare() result: ${isMatch}`);

            if (!isMatch) {
                console.log(`❌ Password does not match for user: ${email}`);
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            console.log(`✅ Password Matched for user: ${email}`);

            // Send success response with token
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        });

    } catch (error) {
        console.log(`🚨 Error in loginUser: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};


// Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile }
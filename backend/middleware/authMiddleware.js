const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user to request (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            console.log(`🔐 Authenticated User: ${req.user.email}`);

            next();
        } catch (error) {
            console.log(`🚨 Invalid Token: ${error.message}`);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log(`🚨 No Token Provided`);
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };

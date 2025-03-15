require('dotenv').config()
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET
const generateToken = (user) => {
    const payload = {
        username: user.username,
        id: user._id,
        role: user.role
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" });
}

module.exports = generateToken
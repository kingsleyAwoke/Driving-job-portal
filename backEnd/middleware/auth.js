const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Save user info to request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = authenticateJWT;
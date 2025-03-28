const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Extract the token after "Bearer "
        const tokenString = token.split(" ")[1];
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

        // Add role-based access control
        const path = req.path;

        // Check if the route requires specific role access
        if (path.startsWith('/admin') && decoded.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin rights required.' });
        }

        if (path.startsWith('/student') && decoded.role !== 'student') {
            return res.status(403).json({ msg: 'Access denied. Student rights required.' });
        }

        // Attach the decoded user information to the request
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        res.status(500).json({ msg: 'Server error during token verification' });
    }
};
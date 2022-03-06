const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader && bearerHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Token is not valid.'
        });
    }
}

module.exports = verifyToken;
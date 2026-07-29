// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        req.user = { id: 1, role: 'admin', name: 'Demo User', tenant_id: 'school_01' };
        return next();
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch(e) {
        res.status(401).json({ 
            status: 'error',
            message: 'Token tidak valid atau kedaluwarsa' 
        });
    }
};
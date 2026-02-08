"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => {
    return async (req, res, next) => {
        const userRole = req.userRole;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};
exports.authorize = authorize;

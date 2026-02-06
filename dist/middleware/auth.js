"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_1.UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.userId = decoded.userId;
        req.userRole = user.role;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;

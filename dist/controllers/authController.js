"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        // Check if user exists
        const existingUser = await User_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password and create user
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const newUser = new User_1.UserModel({
            email,
            password: hashedPassword,
            name,
            role: role || 'customer'
        });
        await newUser.save();
        const token = (0, jwt_1.generateToken)(newUser._id.toString());
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isValidPassword = await (0, password_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)(user._id.toString());
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;

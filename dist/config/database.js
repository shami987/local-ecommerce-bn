"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI is not defined in environment variables');
            console.log('Please update your .env file with a valid MongoDB Atlas connection string');
            process.exit(1);
        }
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Database connection failed:', error);
        console.log('Please check your MongoDB Atlas connection string in .env file');
        process.exit(1);
    }
};
exports.connectDB = connectDB;

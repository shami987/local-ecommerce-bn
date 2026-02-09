import { Request, Response } from 'express';
import { UserModel, UserInput, LoginInput } from '../models/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role }: UserInput = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
      
    // Hash password and create user  
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      name,
      role: role || 'customer'
    });

    await newUser.save();
    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


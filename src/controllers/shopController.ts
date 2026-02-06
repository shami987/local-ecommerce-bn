import { Request, Response } from 'express';
import { ShopModel } from '../models/Shop';

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await ShopModel.find();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const shop = await ShopModel.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createShop = async (req: Request, res: Response) => {
  try {
    const { name, description, location, telephone, email, image } = req.body;
    if (!name || !location || !telephone || !email) {
      return res.status(400).json({ message: 'Name, location, telephone, and email are required' });
    }
    const shop = await ShopModel.create({ name, description, location, telephone, email, image });
    res.status(201).json({ message: 'Shop created successfully', shop });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Shop already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  try {
    const { name, description, location, telephone, email, image } = req.body;
    const shop = await ShopModel.findByIdAndUpdate(
      req.params.id,
      { name, description, location, telephone, email, image },
      { new: true, runValidators: true }
    );
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ message: 'Shop updated successfully', shop });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Shop name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteShop = async (req: Request, res: Response) => {
  try {
    const shop = await ShopModel.findByIdAndDelete(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

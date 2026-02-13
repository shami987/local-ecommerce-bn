import { Request, Response } from 'express';
import { ShopModel } from '../models/Shop';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getMyShops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const shops = await ShopModel.find({ owner: userId });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

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
    const userId = (req as any).userId;
    if (!name || !location || !telephone || !email) {
      return res.status(400).json({ message: 'Name, location, telephone, and email are required' });
    }

    let imageUrl = image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'shops');
    }

    const shop = await ShopModel.create({ name, description, location, telephone, email, image: imageUrl, owner: userId });
    res.status(201).json({ message: 'Shop created successfully', shop });
  } catch (error: any) {
    console.error('Shop creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Shop already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  try {
    const { name, description, location, telephone, email, image } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    const existingShop = await ShopModel.findById(req.params.id);
    if (!existingShop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    if (userRole !== 'admin' && existingShop.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own shops' });
    }

    let imageUrl = existingShop.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'shops');
    } else if (image) {
      imageUrl = image;
    }

    const shop = await ShopModel.findByIdAndUpdate(
      req.params.id,
      { name, description, location, telephone, email, image: imageUrl },
      { new: true, runValidators: true }
    );
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
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    const shop = await ShopModel.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    if (userRole !== 'admin' && shop.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own shops' });
    }
    
    await ShopModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

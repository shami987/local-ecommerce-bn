import { Request, Response } from 'express';
import { ShopModel } from '../models/Shop';
import { uploadToCloudinary } from '../utils/cloudinary';
import { sendNewShopNotification } from '../utils/email';
import { UserModel } from '../models/User';

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

    let imageUrl = image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'shops');
    }

    const shop = await ShopModel.create({ name, description, location, telephone, email, image: imageUrl });
    
    // Send email notifications to all users
    const users = await UserModel.find({}, 'email name');
    const emailPromises = users.map(user => 
      sendNewShopNotification(user.email, user.name, shop.name, shop.location).catch(err => 
        console.error(`Failed to send email to ${user.email}:`, err)
      )
    );
    await Promise.all(emailPromises);

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
    
    const existingShop = await ShopModel.findById(req.params.id);
    if (!existingShop) {
      return res.status(404).json({ message: 'Shop not found' });
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
    const shop = await ShopModel.findByIdAndDelete(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

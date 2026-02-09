import { Request, Response } from 'express';
import { ShopModel } from '../models/Shop';
import { UserModel } from '../models/User';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllShops = async (req: Request, res: Response) => {
  try {
    // Always return all shops for public viewing
    // Shops created by business owners should be visible to everyone
    const shops = await ShopModel.find();
    res.json(shops);
  } catch (error: any) {
    console.error('Get shops error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shops for business owner (their own shops only)
export const getMyShops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (userRole !== 'business_owner' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get user to find their email
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Return only shops owned by this business owner (matched by email)
    const shops = await ShopModel.find({ email: user.email });
    res.json(shops);
  } catch (error: any) {
    console.error('Get my shops error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    console.log('Create shop request body:', req.body);
    console.log('Create shop request file:', req.file ? 'File present' : 'No file');
    
    const { name, description, location, telephone, email } = req.body;
    const userId = (req as any).userId;
    
    if (!name || !location || !telephone || !email) {
      return res.status(400).json({ 
        message: 'Name, location, telephone, and email are required',
        received: { name, location, telephone, email }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'shops');
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError);
        console.warn('Continuing without image due to Cloudinary error');
      }
    }

    const shopData: any = {
      name: name.trim(),
      description: description?.trim() || '',
      location: location.trim(),
      telephone: telephone.trim(),
      email: email.trim(),
    };

    if (imageUrl) {
      shopData.image = imageUrl;
    }

    console.log('Creating shop with data:', {
      name: shopData.name,
      location: shopData.location,
      hasImage: !!shopData.image,
    });

    const shop = await ShopModel.create(shopData);
    console.log('Shop created successfully:', shop._id);
    
    res.status(201).json({ message: 'Shop created successfully', shop });
  } catch (error: any) {
    console.error('Shop creation error:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Shop name already exists' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  try {
    console.log('Update shop request - ID:', req.params.id);
    console.log('Update shop request body:', req.body);
    console.log('Update shop request file:', req.file ? 'File present' : 'No file');
    
    const { name, description, location, telephone, email } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const existingShop = await ShopModel.findById(req.params.id);
    if (!existingShop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (!name || !location || !telephone || !email) {
      return res.status(400).json({ 
        message: 'Name, location, telephone, and email are required',
        received: { name, location, telephone, email }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Handle image update
    let imageUrl = existingShop.image; // Keep existing image by default
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'shops');
        console.log('New image uploaded to Cloudinary:', imageUrl);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError);
        console.warn('Continuing with existing image due to Cloudinary error');
      }
    } else {
      console.log('No new image provided, keeping existing image:', imageUrl);
    }

    const updateData: any = {
      name: name.trim(),
      description: description?.trim() || '',
      location: location.trim(),
      telephone: telephone.trim(),
      email: email.trim(),
    };

    // Always set image (either new or existing)
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    console.log('Updating shop with data:', {
      name: updateData.name,
      location: updateData.location,
      hasImage: !!updateData.image,
    });

    const shop = await ShopModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found after update' });
    }

    console.log('Shop updated successfully:', shop._id);
    res.json({ message: 'Shop updated successfully', shop });
  } catch (error: any) {
    console.error('Shop update error:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Shop name already exists' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

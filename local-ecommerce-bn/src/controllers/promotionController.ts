import { Request, Response } from 'express';
import { PromotionModel } from '../models/Promotion';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    // Always return all promotions for public viewing
    // Promotions created by business owners should be visible to everyone
    const promotions = await PromotionModel.find()
      .populate('shop')
      .populate('category');
    res.json(promotions);
  } catch (error: any) {
    console.error('Get promotions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get promotions for business owner (their own promotions only)
export const getMyPromotions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (userRole !== 'business_owner' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Return only promotions owned by this business owner
    const promotions = await PromotionModel.find({ owner: userId })
      .populate('shop')
      .populate('category');
    res.json(promotions);
  } catch (error: any) {
    console.error('Get my promotions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getActivePromotions = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const promotions = await PromotionModel.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate('shop')
      .populate('category');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPromotionById = async (req: Request, res: Response) => {
  try {
    const promotion = await PromotionModel.findById(req.params.id)
      .populate('shop')
      .populate('category');
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    console.log('Create promotion request body:', req.body);
    console.log('Create promotion request file:', req.file ? 'File present' : 'No file');
    
    const { title, description, discountType, discountValue, location, startDate, endDate, shop, category, terms } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    if (!title || !description || !discountType || !discountValue || !location || !startDate || !endDate || !shop) {
      return res.status(400).json({ 
        message: 'All required fields must be provided',
        received: { title, description, discountType, discountValue, location, startDate, endDate, shop }
      });
    }

    // Validate discount value
    const discountValueNum = parseFloat(discountValue);
    if (isNaN(discountValueNum) || discountValueNum <= 0) {
      return res.status(400).json({ message: 'Discount value must be a positive number' });
    }

    if (discountType === 'percentage' && discountValueNum > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    let bannerImage = '';
    if (req.file) {
      try {
        bannerImage = await uploadToCloudinary(req.file.buffer, 'promotions');
        console.log('Banner image uploaded to Cloudinary:', bannerImage);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError);
        console.warn('Continuing without banner image due to Cloudinary error');
      }
    }

    const promotionData: any = {
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: discountValueNum,
      location: location.trim(),
      startDate: start,
      endDate: end,
      shop,
      owner: userId,
    };

    if (category && category.trim()) {
      promotionData.category = category;
    }

    if (terms && terms.trim()) {
      promotionData.terms = terms.trim();
    }

    if (bannerImage) {
      promotionData.bannerImage = bannerImage;
    }

    console.log('Creating promotion with data:', {
      title: promotionData.title,
      discountType: promotionData.discountType,
      discountValue: promotionData.discountValue,
      shop: promotionData.shop,
      hasBannerImage: !!promotionData.bannerImage,
    });

    const promotion = await PromotionModel.create(promotionData);
    console.log('Promotion created successfully:', promotion._id);

    const populatedPromotion = await PromotionModel.findById(promotion._id)
      .populate('shop')
      .populate('category');

    res.status(201).json({ message: 'Promotion created successfully', promotion: populatedPromotion });
  } catch (error: any) {
    console.error('Promotion creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { title, description, discountType, discountValue, location, startDate, endDate, shop, category, isActive, terms } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const promotion = await PromotionModel.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    if (userRole !== 'admin' && promotion.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own promotions' });
    }

    let bannerImage = promotion.bannerImage;
    if (req.file) {
      bannerImage = await uploadToCloudinary(req.file.buffer, 'promotions');
    }

    const updatedPromotion = await PromotionModel.findByIdAndUpdate(
      req.params.id,
      { title, description, discountType, discountValue, bannerImage, location, startDate, endDate, shop, category, isActive, terms },
      { new: true, runValidators: true }
    ).populate('shop').populate('category');

    res.json({ message: 'Promotion updated successfully', promotion: updatedPromotion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const promotion = await PromotionModel.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    if (userRole !== 'admin' && promotion.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own promotions' });
    }

    await PromotionModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

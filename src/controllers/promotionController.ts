import { Request, Response } from 'express';
import { PromotionModel } from '../models/Promotion';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await PromotionModel.find()
      .populate('shop')
      .populate('category');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    const { title, description, discountType, discountValue, location, startDate, endDate, shop, category, terms } = req.body;
    const userId = (req as any).userId;

    if (!title || !description || !discountType || !discountValue || !location || !startDate || !endDate || !shop) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    let bannerImage = '';
    if (req.file) {
      bannerImage = await uploadToCloudinary(req.file.buffer, 'promotions');
    }

    const promotion = await PromotionModel.create({
      title,
      description,
      discountType,
      discountValue,
      bannerImage,
      location,
      startDate,
      endDate,
      shop,
      category,
      terms,
      owner: userId
    });

    res.status(201).json({ message: 'Promotion created successfully', promotion });
  } catch (error: any) {
    console.error('Promotion creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

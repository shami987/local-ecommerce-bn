import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    let imageUrl = image || '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
    }

    const category = await CategoryModel.create({ name, description, image: imageUrl });
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    
    const existingCategory = await CategoryModel.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    let imageUrl = existingCategory.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
    } else if (image) {
      imageUrl = image;
    }

    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, description, image: imageUrl },
      { new: true, runValidators: true }
    );
    res.json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

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
    console.log('Create category request body:', req.body);
    console.log('Create category request file:', req.file ? 'File present' : 'No file');
    
    const { name, description } = req.body;
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        message: 'Category name is required',
        received: { name }
      });
    }

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError);
        console.warn('Continuing without image due to Cloudinary error');
      }
    }

    const categoryData: any = {
      name: name.trim(),
      description: description?.trim() || '',
    };

    if (imageUrl) {
      categoryData.image = imageUrl;
    }

    console.log('Creating category with data:', {
      name: categoryData.name,
      hasImage: !!categoryData.image,
    });

    const category = await CategoryModel.create(categoryData);
    console.log('Category created successfully:', category._id);
    
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error: any) {
    console.error('Category creation error:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    console.log('Update category request - ID:', req.params.id);
    console.log('Update category request body:', req.body);
    console.log('Update category request file:', req.file ? 'File present' : 'No file');
    
    const { name, description } = req.body;
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const existingCategory = await CategoryModel.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ 
        message: 'Category name is required',
        received: { name }
      });
    }

    // Handle image update
    let imageUrl = existingCategory.image; // Keep existing image by default
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
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
    };

    // Always set image (either new or existing)
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    console.log('Updating category with data:', {
      name: updateData.name,
      hasImage: !!updateData.image,
    });

    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found after update' });
    }

    console.log('Category updated successfully:', category._id);
    res.json({ message: 'Category updated successfully', category });
  } catch (error: any) {
    console.error('Category update error:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await CategoryModel.findByIdAndDelete(req.params.id);
    console.log(`Category ${req.params.id} deleted successfully by user ${userId}`);
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Category deletion error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, category, shop, stock, seller, location } = req.body;
    const userId = (req as any).userId;
    
    if (!name || !price || !category || !seller || !location) {
      return res.status(400).json({ message: 'Name, price, category, seller, and location are required' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
    }
    
    const product = await ProductModel.create({ name, description, price, originalPrice, category, shop, image: imageUrl, stock, seller, location, owner: userId });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, category, shop, stock, seller, location } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    console.log('Update request body:', req.body);
    console.log('User ID:', userId, 'Role:', userRole);
    
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (userRole !== 'admin' && product.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    let imageUrl = product.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
    }
    
    const updateData = {
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      originalPrice: originalPrice !== undefined ? originalPrice : product.originalPrice,
      category: category || product.category,
      shop: shop !== undefined ? shop : product.shop,
      image: imageUrl,
      stock: stock !== undefined ? stock : product.stock,
      seller: seller || product.seller,
      location: location || product.location
    };
    
    console.log('Update data:', updateData);
    
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');
    
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error: any) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (userRole !== 'admin' && product.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }
    
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

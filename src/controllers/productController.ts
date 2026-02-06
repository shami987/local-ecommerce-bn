import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';

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
    const { name, description, price, originalPrice, category, image, stock, seller, location } = req.body;
    if (!name || !price || !category || !seller || !location) {
      return res.status(400).json({ message: 'Name, price, category, seller, and location are required' });
    }
    const product = await ProductModel.create({ name, description, price, originalPrice, category, image, stock, seller, location });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, category, image, stock, seller, location } = req.body;
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { name, description, price, originalPrice, category, image, stock, seller, location },
      { new: true, runValidators: true }
    ).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

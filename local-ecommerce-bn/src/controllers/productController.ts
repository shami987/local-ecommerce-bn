import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Always return all products for public viewing
    // Products added by business owners should be visible to everyone
    const products = await ProductModel.find()
      .populate('category')
      .populate('shop')
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(products);
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get products for business owner (their own products only)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (userRole !== 'business_owner' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Return only products owned by this business owner
    const products = await ProductModel.find({ owner: userId })
      .populate('category')
      .populate('shop')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    console.log('User ID:', (req as any).userId);
    
    const { name, description, price, originalPrice, category, shop, stock, seller, location } = req.body;
    const userId = (req as any).userId;
    
    if (!name || !price || !category || !seller || !location) {
      return res.status(400).json({ 
        message: 'Name, price, category, seller, and location are required',
        received: { name, price, category, seller, location }
      });
    }

    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    // Convert string numbers to actual numbers (FormData sends everything as strings)
    const priceNum = parseFloat(price);
    const originalPriceNum = originalPrice ? parseFloat(originalPrice) : undefined;
    const stockNum = stock ? parseInt(stock, 10) : 0;

    if (isNaN(priceNum)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError);
        // Continue without image if Cloudinary fails
        console.warn('Continuing without image due to Cloudinary error');
      }
    }
    
    const productData: any = {
      name: name.trim(),
      description: description?.trim() || '',
      price: priceNum,
      category,
      seller: seller.trim(),
      location: location.trim(),
      owner: userId,
      stock: stockNum,
    };

    if (originalPriceNum && !isNaN(originalPriceNum)) {
      productData.originalPrice = originalPriceNum;
    }

    if (shop && shop.trim()) {
      productData.shop = shop;
    }

    if (imageUrl) {
      productData.image = imageUrl;
    }
    
    const product = await ProductModel.create(productData);
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Product creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    console.log('Update product request - ID:', req.params.id);
    console.log('Update product request body:', req.body);
    console.log('Update product request file:', req.file ? 'File present' : 'No file');
    
    const { name, description, price, originalPrice, category, shop, stock, seller, location } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (userRole !== 'admin' && product.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    if (!name || !price || !category || !seller || !location) {
      return res.status(400).json({ 
        message: 'Name, price, category, seller, and location are required',
        received: { name, price, category, seller, location }
      });
    }

    // Convert string numbers to actual numbers (FormData sends everything as strings)
    const priceNum = parseFloat(price);
    const originalPriceNum = originalPrice ? parseFloat(originalPrice) : undefined;
    const stockNum = stock ? parseInt(stock, 10) : (product.stock || 0);

    if (isNaN(priceNum)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    // Handle image update
    let imageUrl = product.image; // Keep existing image by default
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer, 'products');
        console.log('New image uploaded to Cloudinary:', imageUrl);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload error:', cloudinaryError);
        // Continue with existing image if Cloudinary fails
        console.warn('Continuing with existing image due to Cloudinary error');
      }
    } else {
      console.log('No new image provided, keeping existing image:', imageUrl);
    }
    
    const updateData: any = {
      name: name.trim(),
      description: description?.trim() || '',
      price: priceNum,
      category,
      seller: seller.trim(),
      location: location.trim(),
      stock: stockNum,
    };

    if (originalPriceNum && !isNaN(originalPriceNum)) {
      updateData.originalPrice = originalPriceNum;
    }

    if (shop && shop.trim()) {
      updateData.shop = shop;
    }

    // Always set image (either new or existing)
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    
    console.log('Updating product with data:', {
      name: updateData.name,
      price: updateData.price,
      hasImage: !!updateData.image,
    });
    
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category').populate('shop');
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found after update' });
    }
    
    console.log('Product updated successfully:', updatedProduct._id);
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error: any) {
    console.error('Product update error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (!userId) {
      return res.status(401).json({ message: 'User authentication required' });
    }
    
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (userRole !== 'admin' && product.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }
    
    await ProductModel.findByIdAndDelete(req.params.id);
    console.log(`Product ${req.params.id} deleted successfully by user ${userId}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Product deletion error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

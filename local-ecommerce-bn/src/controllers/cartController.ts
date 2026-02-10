import { Request, Response } from 'express';
import { CartModel, CartItemDocument } from '../models/Cart';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    let cart = await CartModel.findOne({ userId }).populate('items.product');
    
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
//this is the change we did
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = await CartModel.create({ userId, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item: CartItemDocument) => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    cart = await CartModel.findOne({ userId }).populate('items.product');
    res.json({ message: 'Product added to cart', cart });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item: CartItemDocument) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await CartModel.findOne({ userId }).populate('items.product');
    res.json({ message: 'Cart updated', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item: CartItemDocument) => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await CartModel.findOne({ userId }).populate('items.product');
    res.json({ message: 'Product removed from cart', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

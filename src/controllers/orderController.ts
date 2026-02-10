import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { CartModel } from '../models/Cart';
import { ProductModel } from '../models/Product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const cart = await CartModel.findOne({ userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: (item.product as any).price
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await OrderModel.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    await CartModel.findOneAndUpdate({ userId }, { items: [] });

    const populatedOrder = await OrderModel.findById(order._id).populate('items.product');
    res.status(201).json({ message: 'Order created successfully', order: populatedOrder });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const orders = await OrderModel.find({ userId }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const order = await OrderModel.findOne({ _id: req.params.id, userId }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const userRole = (req as any).userRole;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update order status' });
    }

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).userRole;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const orders = await OrderModel.find().populate('items.product').populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

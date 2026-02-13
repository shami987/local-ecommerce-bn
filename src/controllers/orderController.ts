import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const orders = await OrderModel.find({ user: userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = (req as any).userId;

    if (!items || !totalAmount) {
      return res.status(400).json({ message: 'Items and total amount are required' });
    }

    const order = await OrderModel.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

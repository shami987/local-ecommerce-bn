import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { CartModel } from '../models/Cart';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    // Get user's cart
    const cart = await CartModel.findOne({ userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = cart.items.map((item: any) => {
      const product = item.product;
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      };
    });

    // Create order
    const order = await OrderModel.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    const populatedOrder = await OrderModel.findById(order._id).populate('items.product');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const orders = await OrderModel.find({ userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const order = await OrderModel.findOne({ _id: id, userId }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await OrderModel.findById(id).populate('items.product');

    res.json({
      message: 'Order status updated',
      order: updatedOrder
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

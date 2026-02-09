// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { UserModel } from '../models/User';
import { CategoryModel } from '../models/Category';
import { ShopModel } from '../models/Shop';
import { ProductModel } from '../models/Product';
import { hashPassword } from '../utils/password';

// Seed data
const categories = [
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Home & Kitchen', description: 'Home essentials and kitchenware' },
  { name: 'Beauty & Personal Care', description: 'Beauty products and personal care items' },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
  { name: 'Books', description: 'Books and literature' },
  { name: 'Toys & Games', description: 'Toys and games for all ages' },
];

const users = [
  {
    email: 'admin@niceshop.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    email: 'heritier@gmail.com',
    password: '12345678',
    name: 'heritier',
    role: 'admin' as const,
  },
  {
    email: 'simba@shop.com',
    password: 'business123',
    name: 'Simba Supermarket',
    role: 'business_owner' as const,
  },
  {
    email: 'aaky@shop.com',
    password: 'business123',
    name: 'Aaky Store',
    role: 'business_owner' as const,
  },
  {
    email: 'sbo@shop.com',
    password: 'business123',
    name: 'SBO Electronics',
    role: 'business_owner' as const,
  },
  {
    email: 'levi@shop.com',
    password: 'business123',
    name: 'Levi Store',
    role: 'business_owner' as const,
  },
  {
    email: 'isimbi@gmail.com',
    password: '12345678',
    name: 'isimbi',
    role: 'business_owner' as const,
  },
];

const shops = [
  {
    name: 'Simba Supermarket',
    description: 'Your one-stop shop for groceries and household items',
    location: 'Kigali - Gasabo',
    telephone: '+250788123456',
    email: 'simba@shop.com',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Aaky Fashion',
    description: 'Trendy fashion for everyone',
    location: 'Kigali - Kicukiro',
    telephone: '+250788234567',
    email: 'aaky@shop.com',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'SBO Electronics',
    description: 'Latest electronics and gadgets',
    location: 'Kigali - Nyarugenge',
    telephone: '+250788345678',
    email: 'sbo@shop.com',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Levi Store',
    description: 'Quality clothing and accessories',
    location: 'Musanze',
    telephone: '+250788456789',
    email: 'levi@shop.com',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const products = [
  // Clothing - 12 products
  {
    name: 'Classic Denim Jacket',
    category: 'Clothing',
    price: 89.99,
    originalPrice: 120.00,
    description: 'Timeless denim jacket perfect for any season',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 45,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Elegant White Blouse',
    category: 'Clothing',
    price: 65.00,
    description: 'Professional white blouse for office wear',
    image: 'https://images.pexels.com/photos/9963294/pexels-photo-9963294.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 60,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Casual Summer Dress',
    category: 'Clothing',
    price: 75.00,
    originalPrice: 95.00,
    description: 'Light and comfortable summer dress',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 35,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Men\'s Formal Suit',
    category: 'Clothing',
    price: 250.00,
    originalPrice: 320.00,
    description: 'Premium quality formal suit for special occasions',
    image: 'https://images.pexels.com/photos/1040946/pexels-photo-1040946.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 20,
    shopName: 'Levi Store',
  },
  {
    name: 'Wool Winter Sweater',
    category: 'Clothing',
    price: 95.00,
    description: 'Warm and cozy wool sweater for winter',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 40,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Athletic Sports T-Shirt',
    category: 'Clothing',
    price: 35.00,
    description: 'Breathable athletic t-shirt for workouts',
    image: 'https://images.pexels.com/photos/9963295/pexels-photo-9963295.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 80,
    shopName: 'Levi Store',
  },
  {
    name: 'Designer Leather Jacket',
    category: 'Clothing',
    price: 180.00,
    originalPrice: 250.00,
    description: 'Stylish genuine leather jacket',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 15,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Cotton Casual Pants',
    category: 'Clothing',
    price: 55.00,
    description: 'Comfortable cotton pants for everyday wear',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 50,
    shopName: 'Levi Store',
  },
  {
    name: 'Silk Scarf Collection',
    category: 'Clothing',
    price: 45.00,
    description: 'Luxurious silk scarves in various colors',
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 30,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Kids Playful Outfit Set',
    category: 'Clothing',
    price: 42.00,
    description: 'Colorful and fun outfit set for children',
    image: 'https://images.pexels.com/photos/1598504/pexels-photo-1598504.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 55,
    shopName: 'Levi Store',
  },
  {
    name: 'Vintage Style Hat',
    category: 'Clothing',
    price: 28.00,
    description: 'Classic vintage-style hat for all occasions',
    image: 'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 65,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Premium Sneakers',
    category: 'Clothing',
    price: 120.00,
    originalPrice: 150.00,
    description: 'High-quality comfortable sneakers',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 38,
    shopName: 'Levi Store',
  },
  
  // Electronics - 8 products
  {
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 79.99,
    originalPrice: 120.00,
    description: 'Premium noise-cancelling wireless headphones',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 100,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Smart Watch Pro',
    category: 'Electronics',
    price: 199.99,
    description: 'Feature-packed smartwatch with health tracking',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 75,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Portable Power Bank',
    category: 'Electronics',
    price: 35.00,
    description: 'High-capacity portable charger for all devices',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 150,
    shopName: 'SBO Electronics',
  },
  {
    name: 'USB-C Fast Charging Cable',
    category: 'Electronics',
    price: 15.00,
    description: 'Durable USB-C cable with fast charging support',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 200,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 25.00,
    description: 'Ergonomic wireless mouse for productivity',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 120,
    shopName: 'SBO Electronics',
  },
  {
    name: 'LED Desk Lamp',
    category: 'Electronics',
    price: 45.00,
    description: 'Adjustable LED desk lamp with multiple brightness levels',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 80,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 65.00,
    originalPrice: 89.00,
    description: 'Portable Bluetooth speaker with excellent sound quality',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 60,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Tablet Stand',
    category: 'Electronics',
    price: 20.00,
    description: 'Adjustable stand for tablets and phones',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 90,
    shopName: 'SBO Electronics',
  },
  
  // Home & Kitchen - 6 products
  {
    name: 'Stainless Steel Cookware Set',
    category: 'Home & Kitchen',
    price: 149.99,
    originalPrice: 200.00,
    description: 'Professional 10-piece cookware set',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 60,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Ceramic Dinner Set',
    category: 'Home & Kitchen',
    price: 85.00,
    description: 'Elegant ceramic dinner set for 6 people',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 40,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Coffee Maker Machine',
    category: 'Home & Kitchen',
    price: 120.00,
    description: 'Automatic coffee maker with timer',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 35,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Kitchen Knife Set',
    category: 'Home & Kitchen',
    price: 95.00,
    description: 'Professional 8-piece knife set with block',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 50,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Non-Stick Frying Pan',
    category: 'Home & Kitchen',
    price: 45.00,
    description: 'High-quality non-stick frying pan',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 70,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Storage Container Set',
    category: 'Home & Kitchen',
    price: 35.00,
    description: 'Airtight food storage containers set',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 85,
    shopName: 'Simba Supermarket',
  },
  
  // Beauty & Personal Care - 5 products
  {
    name: 'Luxury Skincare Set',
    category: 'Beauty & Personal Care',
    price: 95.00,
    originalPrice: 130.00,
    description: 'Complete skincare routine in one set',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 35,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Perfume Collection',
    category: 'Beauty & Personal Care',
    price: 75.00,
    description: 'Premium fragrance collection set',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 45,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Hair Care Bundle',
    category: 'Beauty & Personal Care',
    price: 55.00,
    description: 'Complete hair care products bundle',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 60,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Makeup Brush Set',
    category: 'Beauty & Personal Care',
    price: 42.00,
    description: 'Professional makeup brush collection',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 50,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Sunscreen Lotion SPF 50',
    category: 'Beauty & Personal Care',
    price: 28.00,
    description: 'High protection sunscreen for all skin types',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 75,
    shopName: 'Aaky Fashion',
  },
  
  // Sports & Outdoors - 4 products
  {
    name: 'Professional Yoga Mat',
    category: 'Sports & Outdoors',
    price: 45.00,
    originalPrice: 65.00,
    description: 'Non-slip yoga mat with carrying strap',
    image: 'https://images.pexels.com/photos/416475/pexels-photo-416475.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 80,
    shopName: 'Levi Store',
  },
  {
    name: 'Resistance Bands Set',
    category: 'Sports & Outdoors',
    price: 35.00,
    description: 'Complete resistance bands workout set',
    image: 'https://images.pexels.com/photos/416475/pexels-photo-416475.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 65,
    shopName: 'Levi Store',
  },
  {
    name: 'Water Bottle Sports',
    category: 'Sports & Outdoors',
    price: 18.00,
    description: 'Durable sports water bottle',
    image: 'https://images.pexels.com/photos/416475/pexels-photo-416475.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 100,
    shopName: 'Levi Store',
  },
  {
    name: 'Running Shoes',
    category: 'Sports & Outdoors',
    price: 95.00,
    originalPrice: 130.00,
    description: 'Comfortable running shoes for athletes',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 55,
    shopName: 'Levi Store',
  },
  
  // Books - 3 products
  {
    name: 'Best Seller Novel Collection',
    category: 'Books',
    price: 35.00,
    originalPrice: 50.00,
    description: 'Set of 3 award-winning novels',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 50,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Children\'s Story Books',
    category: 'Books',
    price: 25.00,
    description: 'Colorful story books for children',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 70,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Cooking Recipe Book',
    category: 'Books',
    price: 28.00,
    description: 'Comprehensive cooking recipe collection',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 45,
    shopName: 'Simba Supermarket',
  },
  
  // Toys & Games - 2 products
  {
    name: 'Educational Building Blocks',
    category: 'Toys & Games',
    price: 48.00,
    originalPrice: 65.00,
    description: 'Creative building set for kids',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 45,
    shopName: 'Levi Store',
  },
  {
    name: 'Board Game Collection',
    category: 'Toys & Games',
    price: 55.00,
    description: 'Family board games collection set',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 30,
    shopName: 'Levi Store',
  },
  
  // Additional products to reach 60 total
  // Clothing - 8 more
  {
    name: 'Floral Print Maxi Dress',
    category: 'Clothing',
    price: 68.00,
    originalPrice: 85.00,
    description: 'Elegant floral maxi dress for summer',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 28,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Classic White Sneakers',
    category: 'Clothing',
    price: 75.00,
    description: 'Comfortable white sneakers for everyday wear',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 55,
    shopName: 'Levi Store',
  },
  {
    name: 'Striped Polo Shirt',
    category: 'Clothing',
    price: 42.00,
    description: 'Classic striped polo shirt',
    image: 'https://images.pexels.com/photos/9963295/pexels-photo-9963295.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 48,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Knit Cardigan Sweater',
    category: 'Clothing',
    price: 88.00,
    originalPrice: 110.00,
    description: 'Warm knit cardigan for cool weather',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 32,
    shopName: 'Levi Store',
  },
  {
    name: 'Chino Shorts',
    category: 'Clothing',
    price: 38.00,
    description: 'Comfortable chino shorts for summer',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 42,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Linen Button-Down Shirt',
    category: 'Clothing',
    price: 52.00,
    description: 'Breathable linen shirt for hot weather',
    image: 'https://images.pexels.com/photos/9963294/pexels-photo-9963294.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 38,
    shopName: 'Levi Store',
  },
  {
    name: 'Wool Blend Coat',
    category: 'Clothing',
    price: 165.00,
    originalPrice: 200.00,
    description: 'Warm wool blend coat for winter',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 18,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Cotton T-Shirt Pack',
    category: 'Clothing',
    price: 32.00,
    description: 'Pack of 3 basic cotton t-shirts',
    image: 'https://images.pexels.com/photos/9963295/pexels-photo-9963295.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 65,
    shopName: 'Levi Store',
  },
  
  // Electronics - 4 more
  {
    name: 'Wireless Earbuds',
    category: 'Electronics',
    price: 55.00,
    originalPrice: 75.00,
    description: 'True wireless earbuds with charging case',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 90,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Phone Stand',
    category: 'Electronics',
    price: 12.00,
    description: 'Adjustable phone stand for desk',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 150,
    shopName: 'SBO Electronics',
  },
  {
    name: 'USB Hub',
    category: 'Electronics',
    price: 28.00,
    description: '4-port USB hub for multiple devices',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 110,
    shopName: 'SBO Electronics',
  },
  {
    name: 'Laptop Cooling Pad',
    category: 'Electronics',
    price: 38.00,
    description: 'USB-powered laptop cooling pad',
    image: 'https://images.pexels.com/photos/163117/phone-mobile-smartphone-technology-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'SBO Electronics',
    location: 'Kigali - Nyarugenge',
    stock: 70,
    shopName: 'SBO Electronics',
  },
  
  // Home & Kitchen - 3 more
  {
    name: 'Electric Kettle',
    category: 'Home & Kitchen',
    price: 42.00,
    description: 'Stainless steel electric kettle',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 55,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Baking Sheet Set',
    category: 'Home & Kitchen',
    price: 32.00,
    description: 'Set of 3 non-stick baking sheets',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 45,
    shopName: 'Simba Supermarket',
  },
  {
    name: 'Silicone Spatula Set',
    category: 'Home & Kitchen',
    price: 18.00,
    description: 'Heat-resistant silicone spatula set',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 80,
    shopName: 'Simba Supermarket',
  },
  
  // Beauty & Personal Care - 2 more
  {
    name: 'Face Mask Set',
    category: 'Beauty & Personal Care',
    price: 35.00,
    description: 'Hydrating face mask collection',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 50,
    shopName: 'Aaky Fashion',
  },
  {
    name: 'Hair Dryer',
    category: 'Beauty & Personal Care',
    price: 48.00,
    originalPrice: 65.00,
    description: 'Professional hair dryer with multiple settings',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Aaky Fashion',
    location: 'Kigali - Kicukiro',
    stock: 40,
    shopName: 'Aaky Fashion',
  },
  
  // Sports & Outdoors - 2 more
  {
    name: 'Dumbbell Set',
    category: 'Sports & Outdoors',
    price: 85.00,
    description: 'Adjustable dumbbell set for home workouts',
    image: 'https://images.pexels.com/photos/416475/pexels-photo-416475.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 25,
    shopName: 'Levi Store',
  },
  {
    name: 'Jump Rope',
    category: 'Sports & Outdoors',
    price: 15.00,
    description: 'Professional speed jump rope',
    image: 'https://images.pexels.com/photos/416475/pexels-photo-416475.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Levi Store',
    location: 'Musanze',
    stock: 95,
    shopName: 'Levi Store',
  },
  
  // Books - 1 more
  {
    name: 'Business Strategy Books',
    category: 'Books',
    price: 42.00,
    description: 'Collection of business strategy guides',
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: 'Simba Supermarket',
    location: 'Kigali - Gasabo',
    stock: 35,
    shopName: 'Simba Supermarket',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to database
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ShopModel.deleteMany({});
    await ProductModel.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Categories
    console.log('📁 Creating categories...');
    const createdCategories: any[] = [];
    for (const cat of categories) {
      const category = await CategoryModel.create(cat);
      createdCategories.push(category);
      console.log(`   ✓ Created category: ${category.name}`);
    }
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Create Users
    console.log('👤 Creating users...');
    const createdUsers: any[] = [];
    for (const userData of users) {
      const hashedPassword = await hashPassword(userData.password);
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.name} (${user.email})`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create Shops
    console.log('🏪 Creating shops...');
    const createdShops: any[] = [];
    for (const shopData of shops) {
      const shop = await ShopModel.create(shopData);
      createdShops.push(shop);
      console.log(`   ✓ Created shop: ${shop.name}`);
    }
    console.log(`✅ Created ${createdShops.length} shops\n`);

    // Create Products
    console.log('📦 Creating products...');
    let productCount = 0;
    for (const productData of products) {
      // Find category
      const category = createdCategories.find(cat => cat.name === productData.category);
      if (!category) {
        console.log(`   ⚠️  Category not found: ${productData.category}, skipping product: ${productData.name}`);
        continue;
      }

      // Find shop
      const shop = createdShops.find(s => s.name === productData.shopName);
      if (!shop) {
        console.log(`   ⚠️  Shop not found: ${productData.shopName}, skipping product: ${productData.name}`);
        continue;
      }

      // Find owner (business owner user)
      const owner = createdUsers.find(u => u.email === shop.email);
      if (!owner) {
        console.log(`   ⚠️  Owner not found for shop: ${productData.shopName}, skipping product: ${productData.name}`);
        continue;
      }

      const product = await ProductModel.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: category._id,
        shop: shop._id,
        image: productData.image,
        stock: productData.stock,
        seller: productData.seller,
        location: productData.location,
        owner: owner._id,
      });
      productCount++;
      console.log(`   ✓ Created product: ${product.name}`);
    }
    console.log(`✅ Created ${productCount} products\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Shops: ${createdShops.length}`);
    console.log(`   - Products: ${productCount}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seed
seedDatabase();

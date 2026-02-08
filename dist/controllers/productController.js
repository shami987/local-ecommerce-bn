"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const Product_1 = require("../models/Product");
const cloudinary_1 = require("../utils/cloudinary");
const getAllProducts = async (req, res) => {
    try {
        const products = await Product_1.ProductModel.find().populate('category');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.ProductModel.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, shop, stock, seller, location } = req.body;
        const userId = req.userId;
        if (!name || !price || !category || !seller || !location) {
            return res.status(400).json({ message: 'Name, price, category, seller, and location are required' });
        }
        let imageUrl = '';
        if (req.file) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'products');
        }
        const product = await Product_1.ProductModel.create({ name, description, price, originalPrice, category, shop, image: imageUrl, stock, seller, location, owner: userId });
        res.status(201).json({ message: 'Product created successfully', product });
    }
    catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, shop, stock, seller, location } = req.body;
        const userId = req.userId;
        const userRole = req.userRole;
        const product = await Product_1.ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (userRole !== 'admin' && product.owner.toString() !== userId) {
            return res.status(403).json({ message: 'You can only update your own products' });
        }
        let imageUrl = product.image;
        if (req.file) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'products');
        }
        const updatedProduct = await Product_1.ProductModel.findByIdAndUpdate(req.params.id, { name, description, price, originalPrice, category, shop, image: imageUrl, stock, seller, location }, { new: true, runValidators: true }).populate('category');
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.userRole;
        const product = await Product_1.ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (userRole !== 'admin' && product.owner.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own products' });
        }
        await Product_1.ProductModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteProduct = deleteProduct;

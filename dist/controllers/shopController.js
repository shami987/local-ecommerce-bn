"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShop = exports.updateShop = exports.createShop = exports.getShopById = exports.getAllShops = void 0;
const Shop_1 = require("../models/Shop");
const cloudinary_1 = require("../utils/cloudinary");
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop_1.ShopModel.find();
        res.json(shops);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllShops = getAllShops;
const getShopById = async (req, res) => {
    try {
        const shop = await Shop_1.ShopModel.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json(shop);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getShopById = getShopById;
const createShop = async (req, res) => {
    try {
        const { name, description, location, telephone, email, image } = req.body;
        if (!name || !location || !telephone || !email) {
            return res.status(400).json({ message: 'Name, location, telephone, and email are required' });
        }
        let imageUrl = image || '';
        if (req.file) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'shops');
        }
        const shop = await Shop_1.ShopModel.create({ name, description, location, telephone, email, image: imageUrl });
        res.status(201).json({ message: 'Shop created successfully', shop });
    }
    catch (error) {
        console.error('Shop creation error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Shop already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createShop = createShop;
const updateShop = async (req, res) => {
    try {
        const { name, description, location, telephone, email, image } = req.body;
        const existingShop = await Shop_1.ShopModel.findById(req.params.id);
        if (!existingShop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        let imageUrl = existingShop.image;
        if (req.file) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'shops');
        }
        else if (image) {
            imageUrl = image;
        }
        const shop = await Shop_1.ShopModel.findByIdAndUpdate(req.params.id, { name, description, location, telephone, email, image: imageUrl }, { new: true, runValidators: true });
        res.json({ message: 'Shop updated successfully', shop });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Shop name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateShop = updateShop;
const deleteShop = async (req, res) => {
    try {
        const shop = await Shop_1.ShopModel.findByIdAndDelete(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json({ message: 'Shop deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteShop = deleteShop;

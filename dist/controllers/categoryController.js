"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const Category_1 = require("../models/Category");
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category_1.CategoryModel.find();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await Category_1.CategoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const category = await Category_1.CategoryModel.create({ name, description, image });
        res.status(201).json({ message: 'Category created successfully', category });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const category = await Category_1.CategoryModel.findByIdAndUpdate(req.params.id, { name, description, image }, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await Category_1.CategoryModel.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCategory = deleteCategory;

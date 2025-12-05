const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Simple test route
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/categories called');
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('Error in GET /api/categories:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;

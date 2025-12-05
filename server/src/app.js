const express = require('express');
const cors = require('cors');
const app = express();
const env = require('dotenv');
env.config();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/logs', require('./routes/logsRoutes'));
console.log('Loading category routes...');
app.use('/api/categories', require('./routes/categoryRoutes'));
console.log('Category routes loaded');

app.get('/', (req, res) => {
    res.send('Inventory System API Running');
});

// Test route
app.get('/api/categories', (req, res) => {
    console.log('Direct test route called');
    res.json({ message: 'Test route works!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

module.exports = app;

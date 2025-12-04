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

app.get('/', (req, res) => {
    res.send('Inventory System API Running');
});

module.exports = app;

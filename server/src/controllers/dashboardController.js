const Transaction = require('../models/Transaction');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get dashboard summary (KPIs and Charts)
// @route   GET /api/dashboard/summary
// @access  Public
exports.getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // 1. Monthly Revenue & Profit
        const sales = await Transaction.find({
            type: 'sale',
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        let monthlyRevenue = 0;
        let monthlyProfit = 0;

        sales.forEach(sale => {
            monthlyRevenue += sale.totalAmount;
            // Profit = (Selling Price - Cost Price) * Qty
            // We stored cost in items.
            sale.items.forEach(item => {
                const cost = item.cost || 0;
                const profit = (item.price - cost) * item.quantity;
                monthlyProfit += profit;
            });
            // Subtract discount from profit? Yes, discount reduces profit.
            monthlyProfit -= (sale.discount || 0);
        });

        // 2. Monthly Expenses
        const expenses = await Expense.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const monthlyExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        // 3. Monthly Loss (Simplified: Expenses + Returns impact?)
        // User said: Non-resellable returned items, Damaged items, Discount impact.
        // We already subtracted discount from profit.
        // Let's count "Loss" as negative profit items or specific return losses.
        // For now, let's just return 0 or implement later.
        const monthlyLoss = 0; // Placeholder

        // 4. Stock Overview (Bar Chart)
        // Group products by category and sum quantities
        const products = await Product.find().populate('category');
        const stockByCategory = {};

        products.forEach(product => {
            const catName = product.category ? product.category.name : 'Uncategorized';
            if (!stockByCategory[catName]) {
                stockByCategory[catName] = 0;
            }
            stockByCategory[catName] += product.quantity;
        });

        const stockChartData = Object.keys(stockByCategory).map(key => ({
            category: key,
            quantity: stockByCategory[key]
        }));

        // 5. Revenue Trend (Line Chart) - Last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);

        const monthlySales = await Transaction.aggregate([
            {
                $match: {
                    type: 'sale',
                    date: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalRevenue: { $sum: "$totalAmount" },
                    year: { $first: { $year: "$date" } } // Keep year to sort correctly if needed
                }
            },
            { $sort: { "_id": 1 } } // Sort by month index (1-12)
        ]);

        // Format for chart (ensure all 12 months are present or just return what we have)
        // Frontend can handle filling gaps.

        res.json({
            kpi: {
                monthlyRevenue,
                monthlyProfit,
                monthlyExpenses,
                monthlyLoss
            },
            charts: {
                stockOverview: stockChartData,
                revenueTrend: monthlySales
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

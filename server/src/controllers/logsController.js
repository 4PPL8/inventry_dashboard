const Transaction = require('../models/Transaction');

// @desc    Get available years
// @route   GET /api/logs/years
// @access  Public
exports.getYears = async (req, res) => {
    try {
        const years = await Transaction.aggregate([
            {
                $group: {
                    _id: { $year: "$date" }
                }
            },
            { $sort: { _id: -1 } }
        ]);
        res.json(years.map(y => y._id));
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get months for a year
// @route   GET /api/logs/:year
// @access  Public
exports.getMonths = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 0);

        const months = await Transaction.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" } // Just for preview
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(months);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get days for a month
// @route   GET /api/logs/:year/:month
// @access  Public
exports.getDays = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month); // 1-12
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const days = await Transaction.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$date" },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(days);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get transactions for a specific day
// @route   GET /api/logs/:year/:month/:day
// @access  Public
exports.getDayDetails = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        const day = parseInt(req.params.day);

        const startOfDay = new Date(year, month - 1, day);
        const endOfDay = new Date(year, month - 1, day + 1);

        const transactions = await Transaction.find({
            date: { $gte: startOfDay, $lt: endOfDay }
        }).populate('items.product', 'name category');

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Search logs
// @route   GET /api/logs/search
// @access  Public
exports.searchLogs = async (req, res) => {
    try {
        const { q, startDate, endDate } = req.query;

        // Build query conditions
        const conditions = [];

        // Text search conditions
        if (q && q.trim()) {
            conditions.push({
                $or: [
                    { partyName: { $regex: q, $options: 'i' } },
                    { notes: { $regex: q, $options: 'i' } },
                    { 'items.productName': { $regex: q, $options: 'i' } }
                ]
            });
        }

        // Date range conditions
        if (startDate || endDate) {
            const dateCondition = {};
            if (startDate) {
                dateCondition.$gte = new Date(startDate);
            }
            if (endDate) {
                // Set to end of day
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                dateCondition.$lte = endDateTime;
            }
            conditions.push({ date: dateCondition });
        }

        // If no conditions, return empty array
        if (conditions.length === 0) {
            return res.json([]);
        }

        // Combine all conditions with $and
        const query = conditions.length > 1 ? { $and: conditions } : conditions[0];

        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

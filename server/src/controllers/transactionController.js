const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('items.product', 'name category')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a transaction (Sale, Purchase, Return)
// @route   POST /api/transactions
// @access  Public
exports.createTransaction = async (req, res) => {
    const { type, items, partyName, paymentMethod, discount, notes } = req.body;

    try {
        let totalAmount = 0;
        const processedItems = [];

        // Process each item
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            // Calculate item total
            const itemTotal = item.quantity * item.price;
            totalAmount += itemTotal;

            // Update Inventory based on type
            if (type === 'sale') {
                if (product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                }
                product.quantity -= item.quantity;
            } else if (type === 'purchase') {
                product.quantity += item.quantity;
                // Optionally update cost price if needed
            } else if (type === 'return_supplier') {
                if (product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock to return ${product.name}` });
                }
                product.quantity -= item.quantity;
            } else if (type === 'return_customer') {
                product.quantity += item.quantity;
            }

            await product.save();

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: item.price,
                cost: product.costPrice, // Snapshot cost price
                productName: product.name
            });
        }

        // Apply discount
        const finalAmount = totalAmount - (discount || 0);

        const transaction = new Transaction({
            type,
            items: processedItems,
            totalAmount: finalAmount,
            discount,
            partyName,
            paymentMethod,
            notes
        });

        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['sale', 'purchase', 'return_supplier', 'return_customer'],
        required: true
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Price at moment of transaction (cost or sell)
        cost: { type: Number }, // Cost price at time of sale (for profit calc)
        productName: { type: String } // Snapshot of name
    }],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    partyName: { type: String }, // Customer or Supplier name
    paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
    notes: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

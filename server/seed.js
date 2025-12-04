const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Transaction = require('./src/models/Transaction');
const Expense = require('./src/models/Expense');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Transaction.deleteMany({});
        await Expense.deleteMany({});
        console.log('Cleared existing data...');

        // 1. Create Categories - Clothing specific
        const categories = await Category.insertMany([
            { name: 'Casual Wear', description: 'Everyday casual clothing' },
            { name: 'Formal Wear', description: 'Office and formal occasions' },
            { name: 'Party Wear', description: 'Party and evening wear' },
            { name: 'Wedding Wear', description: 'Wedding and special occasions' },
            { name: 'Summer Collection', description: 'Light summer clothing' },
            { name: 'Winter Collection', description: 'Warm winter clothing' },
            { name: 'Unstitched Suits', description: 'Fabric for custom stitching' },
            { name: 'Stitched Suits', description: 'Ready-to-wear suits' },
            { name: 'Designer Wear', description: 'Premium designer collection' }
        ]);
        console.log('Categories seeded');

        // 2. Create Products
        const products = await Product.insertMany([
            // Casual Wear
            { name: 'Cotton Kurti', category: categories[0]._id, quantity: 25, costPrice: 500, sellingPrice: 1200, supplier: 'Fashion Hub', lowStockThreshold: 10 },
            { name: 'Denim Jeans', category: categories[0]._id, quantity: 20, costPrice: 800, sellingPrice: 1800, supplier: 'Fashion Hub', lowStockThreshold: 5 },

            // Formal Wear
            { name: 'Formal Trouser', category: categories[1]._id, quantity: 18, costPrice: 1000, sellingPrice: 2200, supplier: 'Elite Fashion', lowStockThreshold: 8 },
            { name: 'Formal Shirt', category: categories[1]._id, quantity: 14, costPrice: 600, sellingPrice: 1500, supplier: 'Elite Fashion', lowStockThreshold: 5 },

            // Party Wear
            { name: 'Embroidered Dress', category: categories[2]._id, quantity: 10, costPrice: 2000, sellingPrice: 4500, supplier: 'Glamour Collections', lowStockThreshold: 3 },
            { name: 'Party Gown', category: categories[2]._id, quantity: 8, costPrice: 2500, sellingPrice: 5500, supplier: 'Glamour Collections', lowStockThreshold: 2 },

            // Wedding Wear
            { name: 'Bridal Lehenga', category: categories[3]._id, quantity: 5, costPrice: 8000, sellingPrice: 18000, supplier: 'Royal Bridal', lowStockThreshold: 2 },
            { name: 'Sherwani', category: categories[3]._id, quantity: 7, costPrice: 6000, sellingPrice: 14000, supplier: 'Royal Bridal', lowStockThreshold: 2 },

            // Summer Collection
            { name: 'Lawn Suit', category: categories[4]._id, quantity: 35, costPrice: 800, sellingPrice: 2000, supplier: 'Summer Trends', lowStockThreshold: 15 },
            { name: 'Cotton Dupatta', category: categories[4]._id, quantity: 25, costPrice: 300, sellingPrice: 800, supplier: 'Summer Trends', lowStockThreshold: 10 },

            // Winter Collection
            { name: 'Wool Shawl', category: categories[5]._id, quantity: 15, costPrice: 1200, sellingPrice: 2800, supplier: 'Winter Warmth', lowStockThreshold: 5 },
            { name: 'Pashmina', category: categories[5]._id, quantity: 10, costPrice: 1500, sellingPrice: 3500, supplier: 'Winter Warmth', lowStockThreshold: 3 },

            // Unstitched Suits
            { name: 'Lawn Fabric 3pc', category: categories[6]._id, quantity: 40, costPrice: 1000, sellingPrice: 2500, supplier: 'Fabric World', lowStockThreshold: 15 },
            { name: 'Chiffon Fabric 3pc', category: categories[6]._id, quantity: 28, costPrice: 1200, sellingPrice: 3000, supplier: 'Fabric World', lowStockThreshold: 10 },
            { name: 'Silk Fabric 3pc', category: categories[6]._id, quantity: 10, costPrice: 2000, sellingPrice: 4500, supplier: 'Fabric World', lowStockThreshold: 5 },

            // Stitched Suits
            { name: 'Embroidered Suit', category: categories[7]._id, quantity: 30, costPrice: 1500, sellingPrice: 3500, supplier: 'Stitch Perfect', lowStockThreshold: 10 },
            { name: 'Printed Suit', category: categories[7]._id, quantity: 20, costPrice: 1000, sellingPrice: 2500, supplier: 'Stitch Perfect', lowStockThreshold: 8 },

            // Designer Wear
            { name: 'Designer Gown', category: categories[8]._id, quantity: 5, costPrice: 5000, sellingPrice: 12000, supplier: 'Designer Studio', lowStockThreshold: 2 },
            { name: 'Designer Suit', category: categories[8]._id, quantity: 5, costPrice: 4000, sellingPrice: 10000, supplier: 'Designer Studio', lowStockThreshold: 2 }
        ]);
        console.log('Products seeded');

        // 3. Create Transactions for every day in the last 365 days
        const transactions = [];
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Iterate through every day from 1 year ago to today
        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            // Determine daily transaction count (random 1-5 per day)
            // Weekends might have more sales
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            const dailyTransactionCount = isWeekend ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < dailyTransactionCount; i++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;

                transactions.push({
                    type: 'sale',
                    items: [{
                        product: randomProduct._id,
                        quantity: quantity,
                        price: randomProduct.sellingPrice,
                        cost: randomProduct.costPrice,
                        productName: randomProduct.name
                    }],
                    totalAmount: randomProduct.sellingPrice * quantity,
                    partyName: 'Walk-in Customer',
                    paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
                    date: new Date(d), // Clone the date
                    notes: `Sale of ${randomProduct.name}`
                });
            }
        }

        // Add a recent purchase (restock)
        transactions.push({
            type: 'purchase',
            items: [{
                product: products[0]._id,
                quantity: 5,
                price: products[0].costPrice,
                productName: products[0].name
            }],
            totalAmount: products[0].costPrice * 5,
            partyName: 'Fashion Hub',
            paymentMethod: 'online',
            date: new Date()
        });

        await Transaction.insertMany(transactions);
        console.log('Transactions seeded');

        // 4. Create Expenses
        await Expense.insertMany([
            {
                title: 'Shop Rent',
                amount: 1500,
                category: 'Rent',
                date: new Date(today.getFullYear(), today.getMonth(), 1), // 1st of current month
                notes: 'Monthly shop rent'
            },
            {
                title: 'Electricity Bill',
                amount: 250,
                category: 'Utilities',
                date: new Date(today.getFullYear(), today.getMonth(), 5),
                notes: 'Monthly electricity'
            },
            {
                title: 'Internet Bill',
                amount: 60,
                category: 'Utilities',
                date: new Date(today.getFullYear(), today.getMonth(), 5),
                notes: 'Fiber connection'
            },
            {
                title: 'Staff Lunch',
                amount: 45,
                category: 'Miscellaneous',
                date: new Date(today.getFullYear(), today.getMonth(), 10),
                notes: 'Team lunch'
            }
        ]);
        console.log('Expenses seeded');

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedData();

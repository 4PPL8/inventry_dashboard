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

        // 1. Create Categories
        const categories = await Category.insertMany([
            { name: 'Electronics', description: 'Gadgets, computers, and accessories' },
            { name: 'Clothing', description: 'Men and women fashion' },
            { name: 'Home & Garden', description: 'Furniture, decor, and gardening tools' },
            { name: 'Books', description: 'Fiction, non-fiction, and educational' }
        ]);
        console.log('Categories seeded');

        // 2. Create Products
        const products = await Product.insertMany([
            {
                name: 'Gaming Laptop',
                category: categories[0]._id,
                quantity: 15,
                costPrice: 800,
                sellingPrice: 1200,
                supplier: 'TechGiant Inc',
                notes: 'High demand item',
                lowStockThreshold: 5
            },
            {
                name: 'Wireless Headphones',
                category: categories[0]._id,
                quantity: 50,
                costPrice: 50,
                sellingPrice: 120,
                supplier: 'AudioWorld',
                lowStockThreshold: 10
            },
            {
                name: 'Cotton T-Shirt',
                category: categories[1]._id,
                quantity: 100,
                costPrice: 5,
                sellingPrice: 20,
                supplier: 'FashionHub',
                lowStockThreshold: 20
            },
            {
                name: 'Denim Jeans',
                category: categories[1]._id,
                quantity: 40,
                costPrice: 15,
                sellingPrice: 45,
                supplier: 'FashionHub',
                lowStockThreshold: 10
            },
            {
                name: 'Garden Hose',
                category: categories[2]._id,
                quantity: 25,
                costPrice: 10,
                sellingPrice: 30,
                supplier: 'GreenThumb',
                lowStockThreshold: 5
            },
            {
                name: 'Sci-Fi Novel',
                category: categories[3]._id,
                quantity: 60,
                costPrice: 8,
                sellingPrice: 18,
                supplier: 'BookDistro',
                lowStockThreshold: 10
            }
        ]);
        console.log('Products seeded');

        // 3. Create Transactions (History)
        // We'll create some past transactions to show trends
        const transactions = [];
        const today = new Date();

        // Generate sales for the last 30 days
        for (let i = 0; i < 20; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const date = new Date(today);
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));

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
                date: date
            });
        }

        // Add specific sales for the CURRENT MONTH to ensure dashboard shows data
        for (let i = 0; i < 10; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 5) + 1;
            const daysIntoMonth = Math.floor(Math.random() * today.getDate()) + 1;
            const saleDate = new Date(today.getFullYear(), today.getMonth(), daysIntoMonth);

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
                date: saleDate
            });
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
            partyName: 'TechGiant Inc',
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

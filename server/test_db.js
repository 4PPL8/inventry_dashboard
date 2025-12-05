require('dotenv').config();
const mongoose = require('mongoose');

const testAtlas = async () => {
    console.log('Testing Atlas Connection...');
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Atlas Connected Successfully!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Atlas Connection Failed:', error.message);
    }
};

const testLocal = async () => {
    console.log('Testing Local Connection...');
    const localUri = 'mongodb://127.0.0.1:27017/inventry';
    try {
        await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
        console.log('Local DB Connected Successfully!');
        await mongoose.disconnect();
        return true;
    } catch (error) {
        console.error('Local DB Connection Failed:', error.message);
        return false;
    }
};

const runTests = async () => {
    await testAtlas();
    const localWorks = await testLocal();
    if (localWorks) {
        console.log('RECOMMENDATION: Switch to Local DB');
    } else {
        console.log('RECOMMENDATION: Fix Atlas Connection (IP Whitelist?) or Install Local MongoDB');
    }
};

runTests();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = process.argv[2];
        if (!email) {
            console.log('Please provide an email address as an argument.');
            console.log('Usage: node makeAdmin.js <email>');
            process.exit(1);
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();

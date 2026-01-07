const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@itskillhub.com';
        const password = 'admin123';
        const name = 'Admin User';

        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists. Updating role to admin...');
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} updated to admin.`);
        } else {
            console.log('Creating new admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log(`Admin user created successfully.`);
        }

        console.log('-----------------------------------');
        console.log('Admin Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();

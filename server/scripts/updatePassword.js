const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const updatePassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const args = process.argv.slice(2);
        if (args.length < 2) {
            console.log('Usage: node updatePassword.js <email> <newPassword>');
            process.exit(1);
        }

        const email = args[0];
        const newPassword = args[1];

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        console.log(`Success! Password for ${user.email} has been updated.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updatePassword();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // You might need to install bcryptjs in server if not present, but it should be
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resetUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'as@gmail.com'; // Hardcoded for this specific request
        const newPassword = '123456';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found!');
            process.exit(1);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.role = 'admin'; // Also promote to admin

        await user.save();
        console.log(`Success! Password for ${email} reset to '${newPassword}' and role set to 'admin'.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetUser();

const dotenv = require('dotenv');
// Adjusted path: script is in /scripts, models are in /server/models
const User = require('../server/models/User');

dotenv.config({ path: '../server/.env' });

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log('Registered Users:');
        users.forEach(u => {
            console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });

        if (users.length === 0) {
            console.log('No users found.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsers();

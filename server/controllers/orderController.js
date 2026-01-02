const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const Book = require('../models/Book');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { bookId } = req.body;
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const options = {
            amount: book.price * 100, // Amount in currency subunits (paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const response = await razorpay.orders.create(options);

        const order = await Order.create({
            user: req.user._id,
            book: bookId,
            orderId: response.id,
            paymentId: 'pending', // Will be updated on success
            amount: book.price,
            status: 'pending',
        });

        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            orderId: order._id, // Internal DB ID
            key: process.env.RAZORPAY_KEY_ID // Send public key to frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};

// @desc    Verify payment
// @route   POST /api/orders/verify
// @access  Private
const verifyOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment successful
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentId = razorpay_payment_id;
                order.status = 'completed';
                await order.save();

                // Add book to user's purchasedBooks
                const user = await User.findById(req.user._id);
                if (user.purchasedBooks.indexOf(order.book) === -1) {
                    user.purchasedBooks.push(order.book);
                    await user.save();
                }

                res.json({ message: 'Payment successful', orderId: order._id });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('book');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    verifyOrder,
    getMyOrders,
};

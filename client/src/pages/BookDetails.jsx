import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCheck, FiShare2, FiEye, FiShoppingCart, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        const fetchBookAndUser = async () => {
            try {
                const { data } = await axios.get(`/api/books/${id}`);
                setBook(data);

                if (user) {
                    // Get fresh user profile to check purchasedBooks
                    const { data: userData } = await axios.get('/api/users/profile', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setIsPurchased(userData.purchasedBooks.includes(id) || user.role === 'admin');
                }
            } catch (error) {
                console.error("Error", error);
                toast.error('Failed to load details');
            } finally {
                setLoading(false);
            }
        };
        fetchBookAndUser();
    }, [id, user]);

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    const handleBuy = async () => {
        if (!user) {
            toast.error('Please login to purchase');
            navigate('/login');
            return;
        }

        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const loadingToast = toast.loading('Initiating Payment...');

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const { data: orderData } = await axios.post('/api/orders', { bookId: book._id }, config);

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'IT SkillHub',
                description: `Purchase ${book.title}`,
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        toast.loading('Verifying Payment...', { id: loadingToast });
                        const result = await axios.post('/api/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.orderId
                        }, config);

                        toast.dismiss(loadingToast);
                        toast.success(result.data.message || 'Payment Successful!');
                        setIsPurchased(true); // Show download button immediately
                        // navigate('/dashboard'); // Optional: stay on page to download
                    } catch (error) {
                        console.error(error);
                        toast.dismiss(loadingToast);
                        toast.error('Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.dismiss(loadingToast);
                        toast.error('Payment Cancelled');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#4F46E5', // Indigo-600
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Order creation failed", error);
            toast.dismiss(loadingToast);
            toast.error("Could not initiate payment.");
        }
    };

    const handlePreview = () => {
        window.open(`http://localhost:5000/api/books/preview/${book._id}`, '_blank');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );
    if (!book) return <div className="text-center py-20 text-gray-500">Book not found</div>;

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6 md:p-12 pb-24"
        >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden md:flex">
                <div className="md:w-1/3 bg-slate-100 flex items-center justify-center p-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        src={getImageUrl(book.coverImage)}
                        alt={book.title}
                        className="max-h-[500px] shadow-2xl rounded-lg object-cover z-10 rotate-1 hover:rotate-0 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover' }}
                    />
                </div>

                <div className="md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">E-Book</span>
                            <span className="text-gray-400 text-sm">Valid PDF Format</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-800 leading-tight">{book.title}</h1>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">₹{book.price}</div>
                            <div className="text-gray-400 line-through text-lg">₹{Math.round(book.price * 1.5)}</div>
                            <div className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-bold">33% OFF</div>
                        </div>

                        <p className="text-gray-600 leading-relaxed text-lg mb-10">{book.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {[
                                "Instant Download",
                                "High Quality PDF",
                                "Secure Payment",
                                "Lifetime Access"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="bg-green-100 p-1 rounded-full text-green-600"><FiCheck /></div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handlePreview}
                                className="flex-1 px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2 group"
                            >
                                <FiEye className="group-hover:text-indigo-600 transition-colors" /> Preview (2 Pages)
                            </button>
                            <button
                                onClick={handleBuy}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40 transition transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <FiShoppingCart /> Buy Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookDetails;

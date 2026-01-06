import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiCreditCard, FiDownload } from 'react-icons/fi';

const Home = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axios.get('/api/books');
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books", error);
            }
        };
        fetchBooks();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 text-white pb-20 pt-24">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    >
                        Master Your IT Skills
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 font-light"
                    >
                        Premium, curated PDF resources to elevate your career. Instant access, secure downloads.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center gap-4"
                    >
                        <a href="#browse" className="bg-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/50">Browse Books</a>
                    </motion.div>
                </div>
            </div>

            {/* Features Strip */}
            <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-around text-gray-600 gap-4 text-center">
                    <div className="flex items-center justify-center gap-2"><FiBook className="text-indigo-600 text-xl" /> <span className="font-semibold">Expert Content</span></div>
                    <div className="flex items-center justify-center gap-2"><FiCreditCard className="text-indigo-600 text-xl" /> <span className="font-semibold">Secure Payment</span></div>
                    <div className="flex items-center justify-center gap-2"><FiDownload className="text-indigo-600 text-xl" /> <span className="font-semibold">Instant PDF Download</span></div>
                </div>
            </div>

            <section id="browse" className="container mx-auto px-6 py-20">
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
                    <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {books.length > 0 ? (
                        books.map(book => (
                            <motion.div key={book._id} variants={item} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="h-64 overflow-hidden relative bg-gray-100">
                                    <img
                                        src={getImageUrl(book.coverImage)}
                                        alt={book.title}
                                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover' }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link to={`/books/${book._id}`} className="bg-white text-indigo-900 px-6 py-2 rounded-full font-bold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Details</Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">PDF</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">{book.description}</p>
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                        <span className="text-2xl font-extrabold text-gray-900">₹{book.price}</span>
                                        <span className="text-sm text-gray-400">Instant Access</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-500 text-xl">We are stocking up our library. check back soon!</p>
                        </div>
                    )}
                </motion.div>
            </section>
        </div>
    );
};
export default Home;

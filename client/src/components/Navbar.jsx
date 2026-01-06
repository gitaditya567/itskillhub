import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiLayout } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    IT SkillHub
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                                <FiLayout /> Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Admin</Link>
                            )}
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                    <FiUser /> {user.name.split(' ')[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
                                >
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-600 text-2xl" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium">Home</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium">Dashboard</Link>
                                    {user.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium">Admin</Link>}
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-red-600 font-medium">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 font-medium">Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="text-indigo-600 font-medium">Register</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
export default Navbar;

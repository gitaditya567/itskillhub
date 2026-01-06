import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const loadingToast = toast.loading('Creating account...');
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            toast.dismiss(loadingToast);
            toast.success('Account created successfully!');
            login(data);
        } catch (err) {
            toast.dismiss(loadingToast);
            const msg = err.response?.data?.message || 'Registration failed';
            toast.error(msg);
            setError(msg);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex justify-center items-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Join IT SkillHub</h2>
                    <p className="text-gray-500">Start your learning journey today</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center border border-red-100 text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                            placeholder="Min. 6 characters"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition duration-300 transform hover:-translate-y-0.5">
                        Create Account
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold ml-1">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

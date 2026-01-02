import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiMapPin, FiPhone, FiHeart } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                            IT SkillHub
                        </Link>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            Empowering developers with the best resources to master modern technologies. Join our community of learners today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="text-gray-500 hover:text-indigo-600 transition-colors">Home</Link></li>
                            <li><Link to="/dashboard" className="text-gray-500 hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-indigo-600 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="text-gray-500 hover:text-indigo-600 transition-colors">Register</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-gray-500">
                                <FiMail className="flex-shrink-0 text-indigo-600" />
                                <span>support@itskillhub.in</span>
                            </li>
                         
                            <li className="flex items-center gap-2 text-gray-500">
                                <FiMapPin className="flex-shrink-0 text-indigo-600" />
                                <span>Kanpur,Uttar Pradesh</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Stay Updated</h3>
                        <p className="text-gray-500 mb-4 text-sm">Get the latest updates and resources delivered to your inbox.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                        © {new Date().getFullYear()} IT SkillHub. Created by Aditya Sharma.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-xl"><FiGithub /></a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-xl"><FiTwitter /></a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-xl"><FiLinkedin /></a>
                        <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-xl"><FiInstagram /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

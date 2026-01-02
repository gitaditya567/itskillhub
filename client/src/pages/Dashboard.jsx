import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            try {
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchOrders();
    }, [user.token]);

    const handleDownload = async (bookId, title) => {
        try {
            // We need to fetch the blob
            const response = await axios.get(`/api/users/download/${bookId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

        } catch (error) {
            console.error("Download failed", error);
            alert("Download failed. Please try again.");
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Dashboard</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">User Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong className="text-gray-600">Name:</strong> <span className="text-gray-800">{user.name}</span></div>
                    <div><strong className="text-gray-600">Email:</strong> <span className="text-gray-800">{user.email}</span></div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Purchased Books & Downloads</h2>
            {orders.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
                    <p>You haven't purchased any books yet. <a href="/" className="underline font-bold">Browse Books</a></p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                            {order.book ? (
                                <>
                                    <h3 className="font-bold text-lg mb-2 text-gray-800">{order.book.title}</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm text-gray-500">Order: #{order.orderId.substring(order.orderId.length - 6)}</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {order.status === 'completed' && (
                                        <button
                                            onClick={() => handleDownload(order.book._id, order.book.title)}
                                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition shadow-md flex justify-center items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            Download PDF
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p className="text-red-500">Book information unavailable</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Dashboard;

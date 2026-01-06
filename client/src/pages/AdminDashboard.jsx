import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiX, FiUploadCloud, FiFileText, FiImage } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        previewPages: 2,
    });
    const [coverImage, setCoverImage] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get('/api/books');
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books", error);
            toast.error('Failed to load books');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.name === 'coverImage') setCoverImage(e.target.files[0]);
        if (e.target.name === 'pdf') setPdf(e.target.files[0]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (book) => {
        setEditingId(book._id);
        setFormData({
            title: book.title,
            description: book.description,
            price: book.price,
            previewPages: book.previewPages || 2,
        });
        // We don't pre-fill files as they are protected/hidden, user must re-upload if they want to change
        setCoverImage(null);
        setPdf(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', price: '', previewPages: 2 });
        setCoverImage(null);
        setPdf(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book? This cannot be undone.")) return;

        const loadingToast = toast.loading('Deleting book...');
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`/api/books/${id}`, config);
            toast.dismiss(loadingToast);
            toast.success('Book deleted successfully');
            fetchBooks();
        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            toast.error('Failed to delete book');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            // Update Logic
            const loadingToast = toast.loading('Updating book...');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('previewPages', formData.previewPages);
            if (coverImage) data.append('coverImage', coverImage);
            if (pdf) data.append('pdf', pdf);

            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`
                    }
                };
                await axios.put(`/api/books/${editingId}`, data, config);
                toast.dismiss(loadingToast);
                toast.success('Book updated successfully!');
                fetchBooks();
                cancelEdit();
            } catch (error) {
                console.error("Update Error:", error);
                toast.dismiss(loadingToast);
                toast.error(error.response?.data?.message || 'Failed to update book');
            }

        } else {
            // Create Logic
            const loadingToast = toast.loading('Uploading book...');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('previewPages', formData.previewPages);
            data.append('coverImage', coverImage);
            data.append('pdf', pdf);

            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`
                    }
                };
                await axios.post('/api/books', data, config);
                toast.dismiss(loadingToast);
                toast.success('Book added successfully!');
                fetchBooks();
                cancelEdit();
            } catch (error) {
                console.error("Upload Error:", error.response?.data || error.message);
                toast.dismiss(loadingToast);
                const msg = error.response?.data?.message || 'Failed to add book. Please try again.';
                toast.error(msg);
            }
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Edit Book' : 'Add New Book'}
                            </h2>
                            {editingId && (
                                <button onClick={cancelEdit} className="text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1 transition">
                                    <FiX /> Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input type="text" name="title" placeholder="Ex: React Mastery" value={formData.title} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                                    <input type="number" name="price" placeholder="499" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preview Pages</label>
                                    <input type="number" name="previewPages" placeholder="2" value={formData.previewPages} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea name="description" placeholder="Book details..." value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" rows="4" required></textarea>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-dashed border-gray-200">
                                <div className="relative">
                                    <label className="flex items-center gap-2 w-full p-3 bg-indigo-50 text-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-100 transition border border-indigo-200">
                                        <FiImage className="text-xl" />
                                        <span className="text-sm font-semibold truncate">{coverImage ? coverImage.name : (editingId ? "Change Cover (Optional)" : "Select Cover Image")}</span>
                                        <input type="file" name="coverImage" onChange={handleFileChange} className="hidden" accept="image/*" required={!editingId} />
                                    </label>
                                </div>
                                <div className="relative">
                                    <label className="flex items-center gap-2 w-full p-3 bg-red-50 text-red-700 rounded-lg cursor-pointer hover:bg-red-100 transition border border-red-200">
                                        <FiFileText className="text-xl" />
                                        <span className="text-sm font-semibold truncate">{pdf ? pdf.name : (editingId ? "Change PDF (Optional)" : "Select PDF File")}</span>
                                        <input type="file" name="pdf" onChange={handleFileChange} className="hidden" accept="application/pdf" required={!editingId} />
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'}`}>
                                {editingId ? <><FiEdit2 /> Update Book</> : <><FiUploadCloud /> Upload Book</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Manage Library</h2>
                            <p className="text-sm text-gray-500">{books.length} books available</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-100/50">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {books.map(book => (
                                        <tr key={book._id} className="hover:bg-indigo-50/30 transition duration-150 group">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">{book.title}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-[200px]">{book._id}</div>
                                            </td>
                                            <td className="p-4 font-medium text-emerald-600">₹{book.price}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(book)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {books.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-8 text-center text-gray-400 italic">
                                                No books found. Add one to get started!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, required: true }, // Path to upload
    pdfUrl: { type: String, required: true }, // Path to secured PDF
    previewPages: { type: Number, default: 2 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

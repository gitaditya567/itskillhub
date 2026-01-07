const Book = require('../models/Book');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');


// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
    try {
        const { title, description, price, previewPages } = req.body;

        // Files are in req.files (using multers fields) or req.file
        // We expect coverImage and pdf

        // Validating basic existence
        if (!req.files || !req.files.coverImage || !req.files.pdf) {
            return res.status(400).json({ message: 'Please upload both cover image and PDF' });
        }

        const coverImage = req.files.coverImage[0].path;
        const pdfUrl = req.files.pdf[0].path;

        const book = new Book({
            title,
            description,
            price,
            coverImage,
            pdfUrl,
            previewPages: previewPages || 2
        });

        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get book preview (first n pages)
// @route   GET /api/books/preview/:id
// @access  Public
const getPreview = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!fs.existsSync(book.pdfUrl)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const existingPdfBytes = fs.readFileSync(book.pdfUrl);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const totalPages = pdfDoc.getPageCount();

        // Show Cover Page (0) + 2 Content Pages = 3 Pages Total
        const startPage = 0;
        const desiredCount = 3;

        const pageIndices = [];
        for (let i = 0; i < desiredCount; i++) {
            if (startPage + i < totalPages) {
                pageIndices.push(startPage + i);
            }
        }

        // Fallback for empty indices (shouldn't happen if totalPages > 0 and startPage=0)
        if (pageIndices.length === 0 && totalPages > 0) {
            pageIndices.push(0);
        }

        const previewDoc = await PDFDocument.create();
        const pages = await previewDoc.copyPages(pdfDoc, pageIndices);

        pages.forEach(page => previewDoc.addPage(page));

        const pdfBytes = await previewDoc.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBytes.length,
        });

        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Preview generation failed' });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Delete files
        if (book.coverImage && fs.existsSync(book.coverImage)) {
            fs.unlinkSync(book.coverImage);
        }
        if (book.pdfUrl && fs.existsSync(book.pdfUrl)) {
            fs.unlinkSync(book.pdfUrl);
        }

        await book.deleteOne();
        res.json({ message: 'Book removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
    try {
        const { title, description, price, previewPages } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.title = title || book.title;
        book.description = description || book.description;
        book.price = price || book.price;
        book.previewPages = previewPages || book.previewPages;

        if (req.files && req.files.coverImage) {
            // Delete old cover
            if (book.coverImage && fs.existsSync(book.coverImage)) {
                fs.unlinkSync(book.coverImage);
            }
            book.coverImage = req.files.coverImage[0].path;
        }

        if (req.files && req.files.pdf) {
            // Delete old PDF
            if (book.pdfUrl && fs.existsSync(book.pdfUrl)) {
                fs.unlinkSync(book.pdfUrl);
            }
            book.pdfUrl = req.files.pdf[0].path;
        }

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Download book PDF
// @route   GET /api/books/download/:id
// @access  Private
const downloadBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user has purchased the book
        // Admin can always download
        const isPurchased = req.user.purchasedBooks.includes(req.params.id);
        const isAdmin = req.user.role === 'admin';

        if (!isPurchased && !isAdmin) {
            return res.status(403).json({ message: 'You have not purchased this book' });
        }

        if (!fs.existsSync(book.pdfUrl)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(book.pdfUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    getPreview,
    deleteBook,
    updateBook,
    downloadBook
};

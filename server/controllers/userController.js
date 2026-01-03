const axios = require('axios');
const Book = require('../models/Book');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// @desc    Download purchased book
// @route   GET /api/users/download/:id
// @access  Private
const downloadBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user purchased the book or is admin
        const hasPurchased = req.user.purchasedBooks.some(id => id.toString() === book._id.toString());
        if (!hasPurchased && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You have not purchased this book' });
        }

        let pdfBytes;
        if (book.pdfUrl.startsWith('http')) {
            // Fetch from Cloudinary
            const response = await axios.get(book.pdfUrl, { responseType: 'arraybuffer' });
            pdfBytes = response.data;
        } else {
            // Local file
            if (!fs.existsSync(book.pdfUrl)) {
                return res.status(404).json({ message: 'File not found on server' });
            }
            pdfBytes = fs.readFileSync(book.pdfUrl);
        }

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        const watermarkText = `Licensed to ${req.user.email} - IT SkillHub`;

        pages.forEach((page) => {
            const { width, height } = page.getSize();
            page.drawText(watermarkText, {
                x: 50,
                y: 20,
                size: 12,
                color: rgb(0.5, 0.5, 0.5),
                opacity: 0.5,
            });
        });

        const modifiedPdfBytes = await pdfDoc.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
            'Content-Length': modifiedPdfBytes.length,
        });

        res.send(Buffer.from(modifiedPdfBytes));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during PDF processing' });
    }
};

module.exports = {
    downloadBook,
};

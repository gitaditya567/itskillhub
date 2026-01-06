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

        // Check if user purchased the book
        if (!req.user.purchasedBooks.includes(book._id)) {
            return res.status(403).json({ message: 'You have not purchased this book' });
        }

        // Check if file exists
        if (!fs.existsSync(book.pdfUrl)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        const existingPdfBytes = fs.readFileSync(book.pdfUrl);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
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

        const pdfBytes = await pdfDoc.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
            'Content-Length': pdfBytes.length,
        });

        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during PDF processing' });
    }
};

module.exports = {
    downloadBook,
};

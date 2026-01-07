const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const inspectBooks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const books = await Book.find({});
        console.log(`Found ${books.length} books.`);

        for (const book of books) {
            console.log('--------------------------------------------------');
            console.log(`ID: ${book._id}`);
            console.log(`Title: ${book.title}`);
            console.log(`Preview Pages Setting: ${book.previewPages}`);
            console.log(`PDF Path: ${book.pdfUrl}`);

            let filePath = book.pdfUrl;
            if (!fs.existsSync(filePath)) {
                // Try prepending server/ if running from root
                filePath = path.join('server', book.pdfUrl);
            }

            if (fs.existsSync(filePath)) {
                const pdfBytes = fs.readFileSync(filePath);
                const pdfDoc = await PDFDocument.load(pdfBytes);
                console.log(`Actual PDF Total Pages: ${pdfDoc.getPageCount()}`);
            } else {
                console.log(`FILE MISSING at ${book.pdfUrl} (checked ${filePath} too)`);
            }
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspectBooks();

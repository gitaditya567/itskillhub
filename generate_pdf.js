const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createDummyPdf() {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Page 1: Cover
    const page1 = pdfDoc.addPage();
    page1.drawText('COVER PAGE', { x: 50, y: 700, size: 50, font, color: rgb(0, 0, 0) });
    page1.drawText('This is the cover of the book.', { x: 50, y: 650, size: 20, font });

    // Page 2: Content 1
    const page2 = pdfDoc.addPage();
    page2.drawText('PAGE 2', { x: 50, y: 700, size: 50, font, color: rgb(0, 0, 0) });
    page2.drawText('This is the first page of content.', { x: 50, y: 650, size: 20, font });
    page2.drawText('(Should be visible in preview)', { x: 50, y: 600, size: 15, font, color: rgb(0, 0.5, 0) });

    // Page 3: Content 2
    const page3 = pdfDoc.addPage();
    page3.drawText('PAGE 3', { x: 50, y: 700, size: 50, font, color: rgb(0, 0, 0) });
    page3.drawText('This is the second page of content.', { x: 50, y: 650, size: 20, font });
    page3.drawText('(Should be visible in preview)', { x: 50, y: 600, size: 15, font, color: rgb(0, 0.5, 0) });

    // Page 4: Content 3 (Hidden)
    const page4 = pdfDoc.addPage();
    page4.drawText('PAGE 4', { x: 50, y: 700, size: 50, font, color: rgb(1, 0, 0) });
    page4.drawText('This page should require purchase.', { x: 50, y: 650, size: 20, font });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('dummy_book.pdf', pdfBytes);
    console.log('dummy_book.pdf created successfully!');
}

createDummyPdf();

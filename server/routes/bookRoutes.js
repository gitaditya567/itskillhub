const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, getPreview, deleteBook, updateBook, downloadBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getBooks).post(protect, admin, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), createBook);
router.route('/preview/:id').get(getPreview);
router.route('/:id')
    .get(getBookById)
    .delete(protect, admin, deleteBook)
    .put(protect, admin, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), updateBook);

router.get('/download/:id', protect, downloadBook);

module.exports = router;

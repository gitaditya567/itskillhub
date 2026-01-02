const express = require('express');
const router = express.Router();
const { downloadBook } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/download/:id', protect, downloadBook);

module.exports = router;

const express = require('express');
const router = express.Router();

// const { authMiddleware } = require('../middleware/auth');
const { protect } = require('../middlewares/authMiddleware');
const { newComment, getAllCommentsByPost, deleteComment } = require('../controllers/commentController');

// Add a new comment to a post
router.post('/', protect, newComment);
    
router.get('/:postId', getAllCommentsByPost);

// Delete a comment
router.delete('/:id', protect, deleteComment);

module.exports = router;

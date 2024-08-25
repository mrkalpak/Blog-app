const express = require('express');
const { getPosts, getPostById, createPost, updatePost, deletePost, searchposts, getMyblogs } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getPosts);
router.get('/search', searchposts);
router.get('/myblogs',protect,getMyblogs);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;

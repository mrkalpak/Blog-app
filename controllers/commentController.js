const Comment = require('../models/Comment');
const Post = require('../models/Post');


exports.newComment =async (req, res) => {
    try {
    //   const {  } = req.params;
      const {postId, content } = req.body;
        console.log(postId)
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const comment = new Comment({
        postId,
        userId: req.user._id,
        content,
      });
  
      const savedComment = await comment.save();
      res.status(201).json(savedComment);
    } catch (err) {
        console.error(err);
      res.status(400).json({ message: err.message });
    }
  };

   
  // Get all comments for a post
  exports.getAllCommentsByPost =  async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({ postId }).populate('userId', 'username').sort({ createdAt: -1 });
      res.json(comments);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  exports.deleteComment =async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this comment' });
      }
  
      await comment.remove();
      res.json({ message: 'Comment deleted' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  
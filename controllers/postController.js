const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
}).single('image');

exports.getMyblogs = async (req, res) => {
  try {
    // console.log("hlw"); // Check if user ID is logged correctly
    const userId = req.user._id;
    const posts = await Post.find({ userId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'No blogs found for this user.' });
    }

    res.json(posts);
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get the current page or default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the limit or default to 10
    const skip = (page - 1) * limit; // Calculate the number of posts to skip
  
    try {
      const totalPosts = await Post.countDocuments(); // Get the total number of posts
      const posts = await Post.find().populate('userId', 'username').skip(skip).limit(limit); // Fetch posts with skip and limit
  
      res.json({
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit), // Calculate total pages
        currentPage: page,
        posts,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
exports.searchposts= async (req, res) => {
    const { query } = req.query;
    try {
      const posts = await Post.find({ 
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } }
        ] 
      });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });

    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
      const newPost = new Post({
        title,
        content,
        imageUrl,
        userId: req.user._id,
      });
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};

exports.updatePost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });

    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this post' });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      if (req.file) post.imageUrl = imageUrl;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the logged-in user is the owner of the post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    // Delete the post using deleteOne instead of remove
    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

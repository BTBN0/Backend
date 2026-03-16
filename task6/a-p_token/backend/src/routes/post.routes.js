const express = require('express');
const router = express.Router();
const { createPost, getPosts, deletePost } = require('../controllers/post.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/posts', authenticate, getPosts);
router.post('/posts', authenticate, createPost);
router.delete('/posts/:id', authenticate, deletePost); // ABAC энд!

module.exports = router;
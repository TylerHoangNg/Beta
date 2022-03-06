const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Post = require('../models/post');

// @router GET api/posts
// @desc Get a posts
// @access Private
router.get('/', verifyToken, async(req, res) => {
    try {
        const post = await Post.find({ user: req.userId }).populate('user', ['name', 'email']);
        res.json({success: true, post});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @router POST api/posts
// @desc Create a post
// @access Private
router.post('/', verifyToken, async(req, res) => {
    const { title, content, url, status } = req.body;

    //Simple validation
    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' });
    }
    try {
        const newPost = new Post({
            title,
            content,
            url: url.startWith('https://') ? url: `https://${url}`,
            status: status || 'public',
            user: req.userId
        });
        await newPost.save();
        res.json({ success: true, message: 'Post created', post: newPost });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @router PUT api/posts
// @desc Update a post
// @access Private
router.put('/:id', verifyToken, async(req, res) => {
    const { title, content, url, status } = req.body;

    //Simple validation
    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' });
    }
    try {
        let updatePost = new Post({
            title,
            content: content || '',
            url: (url.startWith('https://') ? url: `https://${url}`) || '',
            status: status || 'public',
        });
        const postUpdate = {_id: req.params.id, user: req.userId};

        updatePost = await Post.findOneAndUpdate(postUpdate, updatePost, { new: true });

        // User not authorized to update post
        if (!updatePost) {
            return res.status(401).json({ success: false, message: 'User not authorized' });
        }
        res.json({ success: true, message: 'Post updated', post: updatePost });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @router DELETE api/posts
// @desc Delete a post
// @access Private
router.delete('/:id', verifyToken, async(req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!post) {
            return res.status(401).json({ success: false, message: 'User not authorized' });
        }
        res.json({ success: true, message: 'Post deleted' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
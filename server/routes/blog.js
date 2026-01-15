const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Get all blog posts
router.get('/', async (req, res) => {
	try {
		const posts = await BlogPost.find();
		res.json(posts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Add or update blog posts (replace all)
router.post('/', async (req, res) => {
	try {
		await BlogPost.deleteMany({});
		const posts = await BlogPost.insertMany(req.body);
		res.json(posts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;

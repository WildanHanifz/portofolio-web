const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
	title: String,
	content: String,
	excerpt: String,
	date: String,
	tags: [String],
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);

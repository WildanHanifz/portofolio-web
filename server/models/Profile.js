const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  avatar: String,
  socialLinks: [
    {
      id: String,
      label: String,
      url: String,
    },
  ],
  website: String,
  headerTitle: String,
  headerSubtitle: String,
  showHeader: Boolean,
  headerImage: String,
  headerSlides: [String],
  editPassword: String,
});

module.exports = mongoose.model('Profile', ProfileSchema);

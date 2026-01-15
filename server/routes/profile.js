const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Get profile
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or create profile
router.post('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = new Profile(req.body);
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

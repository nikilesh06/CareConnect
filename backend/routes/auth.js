const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', upload.single('certificate'), async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, experience, fee } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role: role || 'user', phone
    });

    if (user.role === 'doctor') {
      await DoctorProfile.create({
        userId: user._id,
        specialization,
        experience,
        fee,
        certificateFile: req.file ? req.file.path : null
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let profile = null;
    if (user.role === 'doctor') {
      profile = await DoctorProfile.findOne({ userId: user._id });
    }
    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

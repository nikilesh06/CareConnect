const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/doctors/pending', protect, admin, async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ isApproved: false }).populate('userId', '-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/doctors/:id/approve', protect, admin, async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    doctor.isApproved = true;
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDoctors = await DoctorProfile.countDocuments({ isApproved: true });
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.find({ status: 'completed' });
    const totalCommission = completedAppointments.reduce((acc, curr) => acc + curr.adminCommission, 0);

    res.json({ totalUsers, totalDoctors, totalAppointments, totalCommission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/settings', protect, admin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.adminCommissionPercentage = req.body.adminCommissionPercentage || settings.adminCommissionPercentage;
    settings.appName = req.body.appName || settings.appName;
    settings.appLogoUrl = req.body.appLogoUrl || settings.appLogoUrl;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all doctors directory (both approved & pending)
router.get('/doctors', protect, admin, async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({}).populate('userId', '-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all patients list
router.get('/patients', protect, admin, async (req, res) => {
  try {
    const patients = await User.find({ role: 'user' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove/Deactivate doctor and core user profile
router.delete('/doctors/:id', protect, admin, async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    // Remove the core User credentials
    await User.findByIdAndDelete(doctor.userId);
    
    // Remove the Doctor Profile details
    await DoctorProfile.findByIdAndDelete(req.params.id);
    
    // Cancel all future appointments scheduled with this doctor
    await Appointment.deleteMany({ doctorId: req.params.id });

    res.json({ message: 'Doctor and all associated records permanently removed from platform.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

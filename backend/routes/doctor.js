const express = require('express');
const router = express.Router();
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');
const { protect, doctor } = require('../middleware/authMiddleware');

router.put('/profile', protect, doctor, async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.specialization = req.body.specialization || profile.specialization;
    profile.experience = req.body.experience || profile.experience;
    profile.fee = req.body.fee || profile.fee;
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/slots', protect, doctor, async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.availableSlots.push(req.body);
    await profile.save();
    res.json(profile.availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/slots', protect, doctor, async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user._id });
    res.json(profile ? profile.availableSlots : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/appointments', protect, doctor, async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user._id });
    const appointments = await Appointment.find({ doctorId: profile._id }).populate('userId', 'name email phone');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/appointments/:id/prescription', protect, doctor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.prescription = req.body.prescription;
    appointment.status = 'completed';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');
const Settings = require('../models/Settings');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

const isWithin24Hours = (apptDate, slotStartTime) => {
  const appointmentTime = new Date(apptDate);
  const [hours, minutes] = slotStartTime.split(':');
  appointmentTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
  const now = new Date();
  const diffMs = appointmentTime.getTime() - now.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);
  
  return diffHrs <= 24;
};

router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({ isApproved: true }).populate('userId', 'name email phone');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/doctors/:id/slots', protect, async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor.availableSlots.filter(slot => !slot.isBooked));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/appointments', protect, async (req, res) => {
  try {
    const { doctorId, slotId, date, startTime, endTime } = req.body;

    const doctor = await DoctorProfile.findById(doctorId).populate('userId', 'name');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Check if slot exists and is not booked
    const slotIndex = doctor.availableSlots.findIndex(s => s._id.toString() === slotId && !s.isBooked);
    if (slotIndex === -1) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    let settings = await Settings.findOne();
    const commissionPct = settings ? settings.adminCommissionPercentage : 10;
    
    const adminCommission = (doctor.fee * commissionPct) / 100;
    const totalAmount = doctor.fee + adminCommission;

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      date,
      slotStartTime: startTime,
      slotEndTime: endTime,
      doctorFee: doctor.fee,
      adminCommission,
      totalAmount
    });

    doctor.availableSlots[slotIndex].isBooked = true;
    await doctor.save();

    // Create confirmation notifications
    const dateStr = new Date(date).toLocaleDateString();
    await Notification.create({
      userId: req.user._id,
      message: `Appointment successfully booked with Dr. ${doctor.userId?.name} for ${dateStr} at ${startTime}-${endTime}.`
    });

    await Notification.create({
      userId: doctor.userId?._id || doctor.userId,
      message: `New appointment booked by Patient ${req.user.name} for ${dateStr} at ${startTime}-${endTime}.`
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/appointments', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment (no cancellation within 24 hours)
router.put('/appointments/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Restrict cancel within 24 hours
    if (isWithin24Hours(appointment.date, appointment.slotStartTime)) {
      return res.status(400).json({ message: 'Cannot cancel appointments within 24 hours of start time' });
    }

    // Mark appointment as cancelled
    appointment.status = 'cancelled';
    await appointment.save();

    // Release the booked slot on doctor's profile
    const doctor = await DoctorProfile.findById(appointment.doctorId._id).populate('userId', 'name');
    if (doctor) {
      const slotIndex = doctor.availableSlots.findIndex(
        s => s.date.toDateString() === appointment.date.toDateString() &&
             s.startTime === appointment.slotStartTime &&
             s.endTime === appointment.slotEndTime
      );
      if (slotIndex !== -1) {
        doctor.availableSlots[slotIndex].isBooked = false;
        await doctor.save();
      }
    }

    // Create notifications for patient and doctor
    await Notification.create({
      userId: appointment.userId,
      message: `Your appointment with Dr. ${doctor?.userId?.name || ''} has been cancelled.`
    });
    
    if (doctor) {
      await Notification.create({
        userId: doctor.userId?._id || doctor.userId,
        message: `Appointment with Patient ${req.user.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.slotStartTime} has been cancelled.`
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reschedule appointment (auto-move to next available slot)
router.put('/appointments/:id/reschedule', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Restrict reschedule within 24 hours
    if (isWithin24Hours(appointment.date, appointment.slotStartTime)) {
      return res.status(400).json({ message: 'Cannot reschedule appointments within 24 hours of start time' });
    }

    const doctor = await DoctorProfile.findById(appointment.doctorId._id).populate('userId', 'name');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Find the NEXT available slot (chronologically in the future)
    const now = new Date();
    const sortedSlots = doctor.availableSlots
      .map((s, index) => ({ ...s.toObject(), originalIndex: index }))
      .filter(s => !s.isBooked)
      .map(s => {
        const slotTime = new Date(s.date);
        const [hours, minutes] = s.startTime.split(':');
        slotTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return { ...s, slotTime };
      })
      .filter(s => s.slotTime > now)
      .sort((a, b) => a.slotTime - b.slotTime);

    if (sortedSlots.length === 0) {
      return res.status(400).json({ message: 'No future available slots to reschedule to for this doctor' });
    }

    const nextSlot = sortedSlots[0];

    // Release old slot on doctor's profile
    const oldSlotIndex = doctor.availableSlots.findIndex(
      s => s.date.toDateString() === appointment.date.toDateString() &&
           s.startTime === appointment.slotStartTime &&
           s.endTime === appointment.slotEndTime
    );
    if (oldSlotIndex !== -1) {
      doctor.availableSlots[oldSlotIndex].isBooked = false;
    }

    // Reserve new slot
    doctor.availableSlots[nextSlot.originalIndex].isBooked = true;
    await doctor.save();

    // Update appointment details
    const oldDateStr = appointment.date.toLocaleDateString();
    const oldTimeStr = `${appointment.slotStartTime}-${appointment.slotEndTime}`;
    
    appointment.date = nextSlot.date;
    appointment.slotStartTime = nextSlot.startTime;
    appointment.slotEndTime = nextSlot.endTime;
    appointment.sentReminders = []; // Reset reminders for new schedule
    await appointment.save();

    // Create notifications for patient and doctor
    const newDateStr = nextSlot.date.toLocaleDateString();
    const newTimeStr = `${nextSlot.startTime}-${nextSlot.endTime}`;
    const rescheduleMsg = `Appointment with Dr. ${doctor.userId?.name} rescheduled from ${oldDateStr} at ${oldTimeStr} to ${newDateStr} at ${newTimeStr}.`;

    await Notification.create({
      userId: appointment.userId,
      message: rescheduleMsg
    });

    await Notification.create({
      userId: doctor.userId?._id || doctor.userId,
      message: `Appointment with Patient ${req.user.name} rescheduled from ${oldDateStr} at ${oldTimeStr} to ${newDateStr} at ${newTimeStr}.`
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

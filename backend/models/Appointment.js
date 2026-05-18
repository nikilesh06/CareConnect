const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'DoctorProfile', required: true },
  date: { type: Date, required: true },
  slotStartTime: { type: String, required: true },
  slotEndTime: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  doctorFee: { type: Number, required: true },
  adminCommission: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  prescription: { type: String },
  sentReminders: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

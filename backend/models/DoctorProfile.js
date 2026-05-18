const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  fee: { type: Number, required: true },
  certificateFile: { type: String }, // Path to uploaded file
  isApproved: { type: Boolean, default: false },
  availableSlots: [{
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);

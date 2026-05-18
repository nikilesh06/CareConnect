const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  adminCommissionPercentage: { type: Number, default: 10 },
  appName: { type: String, default: 'Doctor App' },
  appLogoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

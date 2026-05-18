const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const DoctorProfile = require('../models/DoctorProfile');

const startReminderCron = () => {
  // Run every minute for highly accurate and testable scheduling
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const appointments = await Appointment.find({ status: 'scheduled' })
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name' }
        })
        .populate('userId', 'name');

      for (const appt of appointments) {
        const apptDate = new Date(appt.date);
        const [hours, minutes] = appt.slotStartTime.split(':');
        apptDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const diffMs = apptDate.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / (1000 * 60));

        let updated = false;

        // 1 Day Reminder (<= 1440 mins and > 60 mins)
        if (diffMins <= 1440 && diffMins > 60 && !appt.sentReminders.includes('1day')) {
          appt.sentReminders.push('1day');
          updated = true;

          const patientMsg = `Reminder: Your appointment with Dr. ${appt.doctorId?.userId?.name || 'Doctor'} is scheduled for tomorrow at ${appt.slotStartTime}.`;
          const doctorMsg = `Reminder: You have an appointment with Patient ${appt.userId?.name || 'Patient'} tomorrow at ${appt.slotStartTime}.`;

          await Notification.create({ userId: appt.userId._id, message: patientMsg });
          if (appt.doctorId?.userId) {
            await Notification.create({ userId: appt.doctorId.userId._id, message: doctorMsg });
          }
        }

        // 1 Hour Reminder (<= 60 mins and > 15 mins)
        if (diffMins <= 60 && diffMins > 15 && !appt.sentReminders.includes('1hour')) {
          appt.sentReminders.push('1hour');
          updated = true;

          const patientMsg = `Reminder: Your appointment with Dr. ${appt.doctorId?.userId?.name || 'Doctor'} starts in 1 hour at ${appt.slotStartTime}.`;
          const doctorMsg = `Reminder: You have an appointment with Patient ${appt.userId?.name || 'Patient'} in 1 hour at ${appt.slotStartTime}.`;

          await Notification.create({ userId: appt.userId._id, message: patientMsg });
          if (appt.doctorId?.userId) {
            await Notification.create({ userId: appt.doctorId.userId._id, message: doctorMsg });
          }
        }

        // 15 Minutes Reminder (<= 15 mins and > 0 mins)
        if (diffMins <= 15 && diffMins > 0 && !appt.sentReminders.includes('15min')) {
          appt.sentReminders.push('15min');
          updated = true;

          const patientMsg = `Alert: Your appointment with Dr. ${appt.doctorId?.userId?.name || 'Doctor'} starts in 15 minutes!`;
          const doctorMsg = `Alert: You have an appointment with Patient ${appt.userId?.name || 'Patient'} starting in 15 minutes!`;

          await Notification.create({ userId: appt.userId._id, message: patientMsg });
          if (appt.doctorId?.userId) {
            await Notification.create({ userId: appt.doctorId.userId._id, message: doctorMsg });
          }
        }

        if (updated) {
          await appt.save();
        }
      }
    } catch (error) {
      console.error('Error executing reminders cron job:', error);
    }
  });

  console.log('Background reminders cron job scheduled successfully');
};

module.exports = startReminderCron;

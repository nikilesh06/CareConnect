require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const DoctorProfile = require('./models/DoctorProfile');
const Appointment = require('./models/Appointment');
const Settings = require('./models/Settings');
const Notification = require('./models/Notification');

const seedDB = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Clearing old data...');

    // Clear old data
    await User.deleteMany({});
    await DoctorProfile.deleteMany({});
    await Appointment.deleteMany({});
    await Settings.deleteMany({});
    await Notification.deleteMany({});

    console.log('Old records successfully purged.');

    // Passwords hashing
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    // Create Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
      phone: '555-0100'
    });
    console.log('Admin seeded: admin@test.com / admin123');

    // Create Patients
    const patientsData = [
      { name: 'Aanya Sharma', email: 'aanya@test.com', phone: '555-0199' },
      { name: 'Bhavesh Patel', email: 'bhavesh@test.com', phone: '555-0144' },
      { name: 'Chetan Kumar', email: 'chetan@test.com', phone: '555-0133' },
      { name: 'Divya Iyer', email: 'divya@test.com', phone: '555-0155' },
      { name: 'Pranav Joshi', email: 'pranav@test.com', phone: '555-0166' }
    ];

    for (const pat of patientsData) {
      await User.create({
        ...pat,
        password: commonPassword,
        role: 'user'
      });
    }
    console.log('5 Patients seeded successfully (password: password123)');

    // Date generation helpers
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);
    const threeDaysAfter = new Date();
    threeDaysAfter.setDate(today.getDate() + 3);

    // Doctors Data
    const doctorsData = [
      {
        name: 'Dr. Shalini Sharma',
        email: 'shalini@test.com',
        phone: '555-0122',
        specialization: 'Cardiologist',
        experience: 15,
        fee: 150,
        slots: [
          { date: today, startTime: '10:00', endTime: '11:00' },
          { date: today, startTime: '14:00', endTime: '15:00' },
          { date: tomorrow, startTime: '09:00', endTime: '10:00' },
          { date: tomorrow, startTime: '11:00', endTime: '12:00' },
          { date: dayAfter, startTime: '15:00', endTime: '16:00' }
        ]
      },
      {
        name: 'Dr. Rajesh Banerjee',
        email: 'rajesh@test.com',
        phone: '555-0177',
        specialization: 'Dermatologist',
        experience: 10,
        fee: 120,
        slots: [
          { date: today, startTime: '11:00', endTime: '12:00' },
          { date: today, startTime: '16:00', endTime: '17:00' },
          { date: tomorrow, startTime: '10:00', endTime: '11:00' },
          { date: tomorrow, startTime: '15:00', endTime: '16:00' },
          { date: dayAfter, startTime: '14:00', endTime: '15:00' }
        ]
      },
      {
        name: 'Dr. Amit Tripathi',
        email: 'amit@test.com',
        phone: '555-0188',
        specialization: 'Neurologist',
        experience: 18,
        fee: 200,
        slots: [
          { date: today, startTime: '09:00', endTime: '10:00' },
          { date: today, startTime: '13:00', endTime: '14:00' },
          { date: tomorrow, startTime: '14:00', endTime: '15:00' },
          { date: dayAfter, startTime: '11:00', endTime: '12:00' },
          { date: threeDaysAfter, startTime: '10:00', endTime: '11:00' }
        ]
      },
      {
        name: 'Dr. Sandeep Sen',
        email: 'sandeep@test.com',
        phone: '555-0111',
        specialization: 'Surgeon',
        experience: 14,
        fee: 250,
        slots: [
          { date: today, startTime: '08:00', endTime: '09:00' },
          { date: tomorrow, startTime: '13:00', endTime: '14:00' },
          { date: tomorrow, startTime: '16:00', endTime: '17:00' },
          { date: dayAfter, startTime: '09:00', endTime: '10:00' },
          { date: threeDaysAfter, startTime: '15:00', endTime: '16:00' }
        ]
      },
      {
        name: 'Dr. Neha Roy',
        email: 'neha@test.com',
        phone: '555-0143',
        specialization: 'Pediatrician',
        experience: 9,
        fee: 110,
        slots: [
          { date: today, startTime: '12:00', endTime: '13:00' },
          { date: tomorrow, startTime: '10:00', endTime: '11:00' },
          { date: tomorrow, startTime: '14:00', endTime: '15:00' },
          { date: dayAfter, startTime: '13:00', endTime: '14:00' }
        ]
      },
      {
        name: 'Dr. Karthik Krishnan',
        email: 'karthik@test.com',
        phone: '555-0154',
        specialization: 'Ophthalmologist',
        experience: 6,
        fee: 90,
        slots: [
          { date: today, startTime: '15:00', endTime: '16:00' },
          { date: tomorrow, startTime: '11:00', endTime: '12:00' },
          { date: dayAfter, startTime: '10:00', endTime: '11:00' },
          { date: threeDaysAfter, startTime: '14:00', endTime: '15:00' }
        ]
      }
    ];

    for (const doc of doctorsData) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: commonPassword,
        role: 'doctor',
        phone: doc.phone
      });

      const slotsWithBooking = doc.slots.map(s => ({
        ...s,
        isBooked: false
      }));

      await DoctorProfile.create({
        userId: user._id,
        specialization: doc.specialization,
        experience: doc.experience,
        fee: doc.fee,
        isApproved: true,
        availableSlots: slotsWithBooking
      });
      console.log(`Doctor seeded: ${doc.email} (${doc.specialization})`);
    }

    // Seed Completed Appointments with Medicine/Prescription Data
    const aliceUser = await User.findOne({ email: 'aanya@test.com' });
    const bobUser = await User.findOne({ email: 'bhavesh@test.com' });
    const charlieUser = await User.findOne({ email: 'chetan@test.com' });

    const sarahDoc = await User.findOne({ email: 'shalini@test.com' });
    const sarahProfile = await DoctorProfile.findOne({ userId: sarahDoc._id });

    const bruceDoc = await User.findOne({ email: 'rajesh@test.com' });
    const bruceProfile = await DoctorProfile.findOne({ userId: bruceDoc._id });

    const tonyDoc = await User.findOne({ email: 'amit@test.com' });
    const tonyProfile = await DoctorProfile.findOne({ userId: tonyDoc._id });

    const natashaDoc = await User.findOne({ email: 'neha@test.com' });
    const natashaProfile = await DoctorProfile.findOne({ userId: natashaDoc._id });

    const adminCommissionPercentage = 12;

    const completedAppts = [
      {
        userId: aliceUser._id,
        doctorId: sarahProfile._id,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        slotStartTime: '10:00',
        slotEndTime: '11:00',
        doctorFee: sarahProfile.fee,
        adminCommission: parseFloat((sarahProfile.fee * (adminCommissionPercentage / 100)).toFixed(2)),
        totalAmount: parseFloat((sarahProfile.fee * (1 + adminCommissionPercentage / 100)).toFixed(2)),
        status: 'completed',
        prescription: 'Atorvastatin 20mg - Take 1 tablet daily before bed. Monitor blood pressure twice a week. Limit caffeine intake.'
      },
      {
        userId: aliceUser._id,
        doctorId: bruceProfile._id,
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        slotStartTime: '11:00',
        slotEndTime: '12:00',
        doctorFee: bruceProfile.fee,
        adminCommission: parseFloat((bruceProfile.fee * (adminCommissionPercentage / 100)).toFixed(2)),
        totalAmount: parseFloat((bruceProfile.fee * (1 + adminCommissionPercentage / 100)).toFixed(2)),
        status: 'completed',
        prescription: 'Hydrocortisone 1% Cream - Apply a thin layer to the affected itchy skin rash twice daily for 5 days. Keep areas dry.'
      },
      {
        userId: bobUser._id,
        doctorId: tonyProfile._id,
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        slotStartTime: '09:00',
        slotEndTime: '10:00',
        doctorFee: tonyProfile.fee,
        adminCommission: parseFloat((tonyProfile.fee * (adminCommissionPercentage / 100)).toFixed(2)),
        totalAmount: parseFloat((tonyProfile.fee * (1 + adminCommissionPercentage / 100)).toFixed(2)),
        status: 'completed',
        prescription: 'Sumatriptan 50mg - Take 1 tablet immediately at onset of severe migraine headaches. Rest in a dark, quiet room.'
      },
      {
        userId: charlieUser._id,
        doctorId: natashaProfile._id,
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        slotStartTime: '12:00',
        slotEndTime: '13:00',
        doctorFee: natashaProfile.fee,
        adminCommission: parseFloat((natashaProfile.fee * (adminCommissionPercentage / 100)).toFixed(2)),
        totalAmount: parseFloat((natashaProfile.fee * (1 + adminCommissionPercentage / 100)).toFixed(2)),
        status: 'completed',
        prescription: 'Cetirizine Syrup 5ml - Give 1 teaspoon daily at evening for seasonal cold, sneezing, and watery eye allergy symptoms.'
      }
    ];

    for (const appt of completedAppts) {
      await Appointment.create(appt);
    }
    console.log('4 Completed Consultation sessions with active medicine prescriptions seeded successfully!');

    // Create App settings
    await Settings.create({
      appName: 'Aegis Health Center',
      adminCommissionPercentage: 12
    });
    console.log('Branding Settings initialized.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();

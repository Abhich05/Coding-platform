import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

const demoUsers = [
  {
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'Admin@1234',
    role: 'admin',
    company: 'Platform HQ',
  },
  {
    name: 'Demo Recruiter',
    email: 'recruiter@demo.com',
    password: 'Recruiter@1234',
    role: 'recruiter',
    company: 'Acme Corp',
  },
  {
    name: 'Demo Candidate',
    email: 'candidate@demo.com',
    password: 'Candidate@1234',
    role: 'candidate',
  },
];

(async () => {
  try {
    await connectDB();

    for (const userData of demoUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⚠️  Already exists: ${userData.email} — skipping`);
        continue;
      }
      await User.create(userData);
      console.log(`✅ Created [${userData.role}]: ${userData.email} / ${userData.password}`);
    }

    console.log('\n🎉 Demo users ready!\n');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.connection.close();
  }
})();

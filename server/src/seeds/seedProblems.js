import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { sampleProblems } from './sampleProblems.js';

dotenv.config();

const seedProblems = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Seeding sample problems...');

    // Drop existing indexes to avoid conflicts
    try {
      await Problem.collection.dropIndexes();
      console.log('📝 Dropped old indexes');
    } catch (err) {
      console.log('ℹ️  No existing indexes to drop');
    }

    // Delete all existing seeded/public problems so we start fresh
    const deleted = await Problem.deleteMany({ isPublic: true });
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Removed ${deleted.deletedCount} existing sample problems`);
    }

    // Find or create a system user for seeded problems
    let systemUser = await User.findOne({ email: 'system@hireright.com' });
    
    if (!systemUser) {
      systemUser = await User.create({
        name: 'System',
        email: 'system@hireright.com',
        password: 'System@123456',
        role: 'admin'
      });
      console.log('✅ Created system user for seeded problems');
    }

    // Add createdBy field to sample problems
    const problemsWithCreator = sampleProblems.map(problem => ({
      ...problem,
      createdBy: systemUser._id,
      isPublic: true
    }));

    // Insert sample problems
    const createdProblems = await Problem.insertMany(problemsWithCreator);
    console.log(`✅ Successfully created ${createdProblems.length} sample problems:`);
    createdProblems.forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.title} (${problem.difficulty})`);
    });

    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding problems:', error);
    process.exit(1);
  }
};

seedProblems();

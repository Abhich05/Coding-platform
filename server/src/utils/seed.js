require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../db/db");
const User = require("../models/User");
const { Job } = require("../models/Job");

(async () => {
    try {
        await connectDB();

        const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@123";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashed = await bcrypt.hash(adminPassword, 10);
            await User.create({ email: adminEmail, password: hashed, fullName: "Admin", role: "admin" });
            console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
        } else {
            console.log("Admin user already exists, skipping");
        }

        const sampleJobs = [
            { title: "Frontend Engineer", company: "Acme Corp", location: "Remote", description: "Build dashboards", tags: ["React", "TypeScript"] },
            { title: "Backend Engineer", company: "Globex", location: "Hybrid", description: "APIs and services", tags: ["Node", "MongoDB"] },
        ];

        const existingJobs = await Job.countDocuments();
        if (existingJobs === 0) {
            await Job.insertMany(sampleJobs);
            console.log("Seeded sample jobs");
        } else {
            console.log("Jobs already present, skipping seeding");
        }
    } catch (err) {
        console.error("Seed failed", err.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
})();

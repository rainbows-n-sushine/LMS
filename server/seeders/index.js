import mongoose from "mongoose";
import connectDB from "../database/db.js";
import { seedUsers } from "./seedUsers.js";
import { seedCourses } from "./seedCourses.js";
import dotenv from "dotenv";

dotenv.config({});

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully.");

    await seedCourses(); // Seed courses first
    await seedUsers(); // Seed users after courses

    mongoose.connection.close();
    console.log("🌱 Database seeding completed.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();

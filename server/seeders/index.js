import mongoose from "mongoose";
import connectDB from "../database/db.js";
import { seedUsers } from "./seedUsers.js";
import { seedCourses } from "./seedCourses.js";
import { seedLectures } from "./seedLectures.js";
import { seedCourseProgress } from "./seedCourseProgress.js";
import { seedCoursePurchase } from "./seedCoursePurchase.js";
import dotenv from "dotenv";

dotenv.config({});

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");
    
    await seedLectures();
    await seedCourses(); 
    await seedUsers();
    await seedCourseProgress();
    await seedCoursePurchase();

    mongoose.connection.close();
    console.log(" Database seeding completed.");
  } catch (error) {
    console.error(" Seeding failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();

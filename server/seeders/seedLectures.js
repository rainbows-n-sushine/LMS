import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Lecture } from "../models/lecture.model.js";
import connectDB from "../database/db.js";

const seedLectures = async () => {
  console.log("🚀 Seeding lectures...");

  await connectDB(); // Ensure database connection

  // Generate 10 fake lectures
  const lectures = Array.from({ length: 10 }).map(() => ({
    lectureTitle: faker.lorem.words(3),
    videoUrl: faker.internet.url(), // Simulated video URL
    publicId: faker.string.uuid(), // Fake public ID
    isPreviewFree: faker.datatype.boolean(), // Random true/false
  }));

  await Lecture.insertMany(lectures);
  console.log("✅ Lectures seeded successfully!");

  console.log("🌱 Database seeding completed.");
};

// Run the function if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedLectures();
}

export { seedLectures };

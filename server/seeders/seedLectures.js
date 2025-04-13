import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Lecture } from "../models/lecture.model.js";
import connectDB from "../database/db.js";

const seedLectures = async () => {
  console.log(" Seeding lectures...");

  await connectDB();


  const lectures = Array.from({ length: 10 }).map(() => ({
    lectureTitle: faker.lorem.words(3),
    videoUrl: faker.internet.url(), 
    publicId: faker.string.uuid(), 
    isPreviewFree: faker.datatype.boolean(), 
  }));

  await Lecture.insertMany(lectures);
  console.log(" Lectures seeded successfully!");

  console.log(" Database seeding completed.");
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seedLectures();
}

export { seedLectures };

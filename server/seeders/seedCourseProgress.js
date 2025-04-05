import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js";
import connectDB from "../database/db.js";

const seedCourseProgress = async () => {
  console.log("🚀 Seeding course progress...");

  await connectDB(); // Ensure database connection

  // Fetch users, courses, and lectures
  const users = await User.find({}, "_id");
  const courses = await Course.find({}, "_id");
  const lectures = await Lecture.find({}, "_id");

  if (users.length === 0 || courses.length === 0 || lectures.length === 0) {
    console.log("⚠️ No users, courses, or lectures found! Please seed them first.");
    mongoose.connection.close();
    return;
  }

  // Generate course progress data for users
  const courseProgressData = users.map((user) => {
    const course = faker.helpers.arrayElement(courses); // Assign a random course
    const courseLectures = lectures.filter((lecture) => faker.datatype.boolean()); // Select some lectures for progress

    return {
      userId: user._id,
      courseId: course._id,
      completed: faker.datatype.boolean(),
      lectureProgress: courseLectures.map((lecture) => ({
        lectureId: lecture._id,
        viewed: faker.datatype.boolean(),
      })),
    };
  });

  await CourseProgress.insertMany(courseProgressData);
  console.log("✅ Course progress seeded successfully!");

  mongoose.connection.close(); // Close connection
  console.log("🌱 Database seeding completed.");
};

// Run directly if executed from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCourseProgress();
}

export { seedCourseProgress };

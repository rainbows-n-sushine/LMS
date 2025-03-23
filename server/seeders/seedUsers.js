import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

export const seedUsers = async () => {
  console.log("🚀 Seeding users...");

  try {
    // Fetch available courses from the database
    const courses = await Course.find({}, "_id");
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length === 0) {
      console.warn("⚠️ No courses found! Please seed courses first.");
    }

    // Delete only previously seeded users
    await User.deleteMany();

    // Generate fake users with valid course references
    const users = Array.from({ length: 10 }).map(() => ({
      name: faker.person.fullName(), // Ensure this exists in your faker version
      email: faker.internet.email(),
      password:"$2a$10$jyR3PW1Q0MZKibmCbPDAV.kxsgjjfbIZvs.qVaTlm5AaAWJFanGEK",        //faker.internet.password(),
      role: faker.helpers.arrayElement(["instructor", "student"]),
      enrolledCourses: courseIds.length
        ? faker.helpers.arrayElements(courseIds, faker.number.int({ min: 1, max: Math.min(3, courseIds.length) })) // Avoid selecting more than available courses
        : [], // If no courses, set an empty array
      photoUrl: faker.image.avatar(),
    }));

    await User.insertMany(users);
    console.log("✅ Seeded users inserted successfully!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
};

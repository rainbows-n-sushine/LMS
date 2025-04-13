import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js"; 
import connectDB from "../database/db.js";

const seedCoursePurchase = async () => {
  try {
    await connectDB();
    console.log(" Seeding course purchases...");

    await CoursePurchase.deleteMany();

    const users = await User.find();
    const courses = await Course.find();

    if (users.length === 0 || courses.length === 0) {
      throw new Error("Not enough users or courses in the database.");
    }

    const purchases = Array.from({ length: 15 }).map(() => {
      const user = faker.helpers.arrayElement(users);
      const course = faker.helpers.arrayElement(courses);

      return {
        userId: user._id,
        courseId: course._id,
        amount: faker.number.int({ min: 10, max: 500 }),
        status: faker.helpers.arrayElement(["pending", "completed", "failed"]),
        paymentId: `pay_${faker.string.alphanumeric(8)}`
      };
    });

    await CoursePurchase.insertMany(purchases);
    console.log("Course purchases seeded successfully!");
  } catch (error) {
    console.error(" Seeding failed:", error.message);
  }
};

export { seedCoursePurchase };

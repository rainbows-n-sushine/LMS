import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js"; 
import connectDB from "../database/db.js";

const courseCategories = [
  "Next JS",
  "Data Science",
  "Frontend Development",
  "Fullstack Development",
  "MERN Stack Development",
  "Backend Development",
  "Javascript",
  "Python",
  "Docker",
  "MongoDB",
  "HTML",
];

const seedCourses = async () => {
  try {
    await connectDB(); 
    console.log(" Seeding courses...");

    await Course.deleteMany();

    const allLectures = await Lecture.find(); 
    const users = await User.find(); 

    if (allLectures.length === 0) {
      throw new Error("No lectures found in the database. Please seed lectures first.");
    }

    const courses = Array.from({ length: 10 }).map(() => {

      const randomLectures = faker.helpers.arrayElements(allLectures, faker.number.int({ min: 2, max: 5 }));
      const randomUser = faker.helpers.arrayElement(users);

      return {
        courseTitle: faker.lorem.words(3),
        subTitle: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        category: faker.helpers.arrayElement(courseCategories),
        courseLevel: faker.helpers.arrayElement(["Beginner", "Medium", "Advance"]),
        coursePrice: faker.number.int({ min: 10, max: 500 }),
        courseThumbnail: faker.image.urlPicsumPhotos(),
        isPublished: faker.datatype.boolean(),
        lectures: randomLectures.map(lec => lec._id),
        creator: randomUser?._id || null,
      };
    });

    await Course.insertMany(courses);
    console.log(" Courses seeded successfully!");
  } catch (error) {
    console.error(" Seeding failed:", error.message);
  } 
};

export { seedCourses };

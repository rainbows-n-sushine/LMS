import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
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
  console.log("🚀 Seeding courses...");

  // Fetch available users to assign as creators
  try{
  

  // Delete only previously seeded courses
  await Course.deleteMany();

  const courses = Array.from({ length: 10 }).map(() => ({
    courseTitle: faker.lorem.words(3),
    subTitle: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(courseCategories),
    courseLevel: faker.helpers.arrayElement(["Beginner", "Medium", "Advance"]),
    coursePrice: faker.number.int({ min: 10, max: 500 }),
    courseThumbnail: faker.image.urlPicsumPhotos(),
    isPublished: faker.datatype.boolean(),
  }));

  await Course.insertMany(courses);
  console.log("✅ Courses seeded successfully!");

  }catch(error){
    if(error){
    console.log(error.message)
  }}
  
};

export { seedCourses };

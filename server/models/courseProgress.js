import mongoose from "mongoose"

const lectureProgressSchema = new mongoose.Schema({
    lectureId:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:'Lecture',
            default:null},
    viewed:{type:Boolean}
});

const courseProgressSchema = new mongoose.Schema({
    userId:{  
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:null},
    courseId:{   
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course',
            default:null},
    completed:{type:Boolean},
    lectureProgress:[lectureProgressSchema]
});

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
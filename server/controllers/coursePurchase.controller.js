
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import {fetchUserProfile} from "./user.controller.js";
import {config} from "../middlewares/chapaAuthentication.js"
import axios from "axios";
import stripe from "stripe"
const PORT=process.env.PORT;

const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_AUTH = process.env.CHAPA_AUTH // || register to chapa and get the key
const CALLBACK_URL = process.env.CALLBACK_URL
const RETURN_URL = process.env.RETURN_URL



export const createCheckoutSession = async (req, res) => {


  try {


    console.log("We're in create checouy session")
    const userId = req.id;
    const { courseId } = req.body;
    const userInfo= await fetchUserProfile(userId)
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const TEXT_REF = "tx-mylms12345-" + Date.now()

        // form data
        const firstName=userInfo.name.trim().split(' ')[0]
        const lastName=userInfo.name.trim().split(' ')[2] ? userInfo.name.trim().split(' ')[2]: "empty"
        const data = {
          amount: course.coursePrice, 
          currency: 'ETB',
          email: userInfo.email,
          first_name:firstName,
          last_name: lastName,
          tx_ref: TEXT_REF,
          callback_url: CALLBACK_URL + TEXT_REF,
          return_url: RETURN_URL
      }

      // console.log('this is the value of res.', data)
      
    const lastPurchase = await CoursePurchase.findOne().sort({ _id: -1 });

    // Step 2: Generate new paymentId
    let newPaymentId = 'PAY-1000'; // default if none exists

    if (lastPurchase && lastPurchase.paymentId) {
        // Extract the numeric part and increment
        const lastIdNum = parseInt(lastPurchase.paymentId.split('-')[1], 10);
        newPaymentId = `PAY-${lastIdNum + 1}`;
    }
    newPurchase.paymentId = newPaymentId;
    await newPurchase.save();

   

      // post request to chapa
      await axios.post(CHAPA_URL, data, config)
          .then((response) => {
            // Save the purchase record
            console.log("This is response:" ,response)
            
            return res.status(200).json({
              success: true,
              url: response.data.data.checkout_url, // Return the Stripe checkout URL
            });
              // res.redirect(response.data.data.checkout_url)
          })
          .catch((err) => console.log(err))
         
          
}catch(err){
  if(err){
    console.log(err)
  }
}

  
};



//Verify payment

export const verifyPayment= async (req, res) => {
    
  //verify the transaction 
  await axios.get("https://api.chapa.co/v1/transaction/verify/" + req.params.id, config)
      .then((response) => {
        console.log(response.data)
          console.log("Payment was successfully verified")
      }) 
      .catch((err) => console.log("Payment can't be verfied", err))
}


///
export const paymentSuccess= async (req, res) => {
  res.render("success")
}








export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};

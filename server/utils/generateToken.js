import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  console.log("This is the token before it is returned: ", token);

  return res.status(200).json({
    success: true,
    message,
    user,
    token, // <-- Frontend will store this in localStorage
  });
};

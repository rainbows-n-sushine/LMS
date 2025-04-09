import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    console.log("Token received:", token);

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuthenticated;

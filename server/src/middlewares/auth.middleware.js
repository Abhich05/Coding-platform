const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

// Auth via Authorization: Bearer <token>
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message === "USER_NOT_FOUND" ? "User not found" : "Invalid token"
    });
  }
};

// Auth via Authorization: Bearer <token> OR cookies
const auth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // If no cookie, check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied: Token missing"
      });
    }

    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message === "USER_NOT_FOUND" ? "User not found" : "Invalid or expired token"
    });
  }
};

// Role based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};

module.exports = {
  protect,
  auth,
  authorize
};

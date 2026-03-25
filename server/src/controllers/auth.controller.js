const userModel = require('../models/User');
const authService = require('../services/auth.service');

async function registerUser(req, res) {
  console.log('🔥 REGISTER HIT - body:', JSON.stringify(req.body));
  
  try {
    console.log('📝 Calling authService.register...');
    const newUser = await authService.register(req.body);
    console.log('✅ USER CREATED:', newUser._id);
    
    const token = await authService.generateToken(newUser);
    res.cookie("token", token);
    
    res.status(201).json({
      message: "User Created Successfully!",
      data: {
        id: newUser._id,
        email: newUser.email
      }
    });
  } catch (e) {
    console.log('❌ REGISTER ERROR:', e.message);
    console.log('❌ FULL ERROR:', e.stack);
    res.status(400).json({
      message: e.message
    });
  }
}

async function loginUser(req, res) {
  try {
    const userDetail = await authService.login(req.body);
    const token = await authService.generateToken(userDetail);
    
    res.status(200).json({
      message: "User Logged in Successfully!",
      token: token,
      user: {
        id: userDetail._id,
        email: userDetail.email
      }
    });
  } catch (e) {
    res.status(400).json({
      message: e.message
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (e) {
    res.status(500).json({
      message: "Server Error"
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe 
};

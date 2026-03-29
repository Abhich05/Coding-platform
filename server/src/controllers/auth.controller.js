const userModel=require('../models/User');
const authService=require('../services/auth.service');

async function registerUser(req,res){
  try{
    const newUser=await authService.register(req.body);
    const token=await authService.generateToken(newUser);

    res.status(201).json({
      message:"User Created Successfully!",
      token,
      data:{
        id:newUser._id,
        email:newUser.email,
        fullName:newUser.fullName,
        role:newUser.role
      }
    })
  }
  catch(e){
    res.status(400).json({ message:e.message })
  }
}

async function loginUser(req,res){
  try{
    const userDetail=await authService.login(req.body);
    const token=await authService.generateToken(userDetail);

    res.status(200).json({
      message:"User Logged in Successfully!",
      token,
      data:{
        id:userDetail._id,
        email:userDetail.email,
        fullName:userDetail.fullName,
        role:userDetail.role
      }
    })
  }
  catch(e){
    res.status(400).json({ message:e.message })
  }
}




module.exports = {
    registerUser,
    loginUser,
   
};

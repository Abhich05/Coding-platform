const userModel=require('../models/User');
async function registerUser(req,res) {
    res.status(201).json({
        message:"User created sucessfully"
    });
    
}

module.exports={
    registerUser
};
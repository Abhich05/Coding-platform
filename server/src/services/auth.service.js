const userModel=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

exports.register=async(userData)=>{
    const {name,email,password}=userData;
    const userDetail=await userModel.findOne({email});

    if(userDetail){
    throw new Error("User Already exists");
    }

    const hashedPass=await bcrypt.hash(password,10);

    return await userModel.create({
        name,
        email,
        password:hashedPass
    })
}
exports.login=async(userData)=>{
   const { email, password } = userData;
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error("invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("invalid email or password");
    }
    return user;
}

exports.generateToken=async(user)=>{
    return jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_SECRET,
    {expiresIn: "7d"}
)
}
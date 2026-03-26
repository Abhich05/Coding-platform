const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({ 
    email:{
        type: String, unique: true 
    }, 
    password:{
        type:String
    }, 
    role:{
        type: String,
        default: "User" 
    }, 
    createdAt:{
        type: Date,
        default: Date.now
    } 
});

const userModel=mongoose.model("User",userSchema);

module.exports=userModel;
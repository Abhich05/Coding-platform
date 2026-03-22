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
        default: "user" 
    }, 
    createdAt:{
        type: Date,
        default: Date.now
    } 
});

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;
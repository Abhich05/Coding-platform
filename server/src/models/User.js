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
userSchema.pre('save', function(next) {
  if (!this.name && this.email) {
    this.name = this.email.split('@')[0];
  }
  next();
});

const userModel=mongoose.model("User",userSchema);

module.exports=userModel;
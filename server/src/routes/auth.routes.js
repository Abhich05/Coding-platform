const express= require('express');
const router=express.Router();
const {registerUser}=require('../controllers/auth.controller.js');
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/me', auth, getMe);
module.exports=router;

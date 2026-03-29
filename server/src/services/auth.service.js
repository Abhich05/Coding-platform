const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (userData) => {
    const { email, password, fullName, role } = userData;
    const userDetail = await userModel.findOne({ email });

    if (userDetail) {
        throw new Error("User Already exists");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    return await userModel.create({
        email,
        password: hashedPass,
        fullName: fullName || email.split('@')[0],
        role: (role || "user").toLowerCase(),
    })
}
exports.login = async (userData) => {
    const { email, password, role } = userData;
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error("invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("invalid email or password");
    }
    if (role && user.role !== role) {
        throw new Error("Unauthorized role");
    }
    return user;
}

exports.generateToken = async (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}
import Profile from "../models/Profile.js";

// GET profile and include email from User model
export const getMyProfile = async (userId) => {
  // We populate 'userId' and specifically request the 'email' field
  const profile = await Profile.findOne({ userId }).populate("userId", "email");
  return profile;
};

// Update or create profile
export const updateMyProfile = async (userId, payload) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true, upsert: true }
  ).populate("userId", "email");
  return profile;
};
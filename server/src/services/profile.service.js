const Profile = require("../models/Profile");

exports.getMyProfile = async (userId) => {
  const profile = await Profile.findOne({ userId });
  return profile;
};

//update the profile of logged-in user
exports.updateMyProfile = async (userId, payload) => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true, upsert: true }
  );
  return profile;
};

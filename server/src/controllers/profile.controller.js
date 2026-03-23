const profileService = require("../services/profile.service");
const { success, error } = require("../utils/apiResponse");

// GET /api/profile/me
exports.getMe = async (req, res) => {
  try {
    const profile = await profileService.getMyProfile(req.user._id);

    return success(res, profile || null);
  } catch (err) {
    return error(res, err.message);
  }
};

// PUT /api/profile/update
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, avatarUrl } = req.body;

    const profile = await profileService.updateMyProfile(req.user._id, {
      name,
      bio,
      skills,
      avatarUrl,
    });

    return success(res, profile);
  } catch (err) {
    return error(res, err.message);
  }
};

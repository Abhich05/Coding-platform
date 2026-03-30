import * as profileService from "../services/profile.service.js";
import { success, error } from "../utils/apiResponse.js";

// GET /api/profile/me
export const getMe = async (req, res) => {
  try {
    const profile = await profileService.getMyProfile(req.user._id);

    // If no profile exists, we still return the user's email from the auth object
    if (!profile) {
      return success(res, { email: req.user.email });
    }

    // Flatten the populated userId.email into a top-level 'email' property
    const responseData = {
      ...profile._doc,
      email: profile.userId ? profile.userId.email : req.user.email,
    };

    return success(res, responseData);
  } catch (err) {
    return error(res, err.message);
  }
};

// PUT /api/profile/update
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, avatarUrl } = req.body;

    const profile = await profileService.updateMyProfile(req.user._id, {
      name,
      bio,
      skills,
      avatarUrl,
    });

    const responseData = {
      ...profile._doc,
      email: profile.userId ? profile.userId.email : req.user.email,
    };

    return success(res, responseData);
  } catch (err) {
    return error(res, err.message);
  }
};
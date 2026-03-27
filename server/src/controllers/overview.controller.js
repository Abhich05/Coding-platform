const overviewService = require("../services/overview.service");
const { success, error } = require("../utils/apiResponse");

exports.getStats = async (req, res) => {
  try {
    const stats = await overviewService.getStats(req.user._id);
    return success(res, stats);
  } catch (err) {
    return error(res, err.message);
  }
};

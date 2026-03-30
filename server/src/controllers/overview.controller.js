import * as overviewService from "../services/overview.service.js";
import { success, error } from "../utils/apiResponse.js";

export const getStats = async (req, res) => {
  try {
    const stats = await overviewService.getStats(req.user._id);
    return success(res, stats);
  } catch (err) {
    return error(res, err.message);
  }
};

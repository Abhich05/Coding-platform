const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const { getStats } = require("../controllers/overview.controller");

router.get("/stats", auth, getStats);

module.exports = router;

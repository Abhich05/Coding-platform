import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getTestByCode, submitTest } from "../controllers/test.controller.js";

const router = express.Router();

// Fetch a test by code (no auth required for read)
router.get("/:code", getTestByCode);

// Submit answers for a test (auth optional; uses user if present)
router.post("/:code/submit", authOptional, submitTest);

// Optional auth: attach req.user if token is valid; otherwise continue
async function authOptional(req, _res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
            req.user = user;
        }
    } catch (_err) {
        // ignore errors to allow anonymous submissions
    }
    return next();
}

export default router;

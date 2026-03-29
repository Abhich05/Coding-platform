require('dotenv').config({ override: true });
const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require('./src/routes/auth.routes');
const authJobs = require('./src/routes/jobs.routes')
const connectDB = require('./src/db/db');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// //main routes 
app.use("/api/auth", authRoutes);
app.use("/api/jobs", authJobs);
app.use("/api/profile", require("./src/routes/profile.routes"));
app.use("/api/overview", require("./src/routes/overview.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/tests", require("./src/routes/tests.routes"));

//server starting
const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();

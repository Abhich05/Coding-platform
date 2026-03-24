require('dotenv').config();
const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
const authRoutes=require('./src/routes/auth.routes');
const authJobs=require('./src/routes/jobs.routes')
const connectDB=require('./src/db/db');
const cookieParser=require('cookie-parser');

connectDB();
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true               
}));

// //main routes 
app.use("/api/auth",authRoutes); 
app.use("/api/jobs",authJobs); 
app.use("/api/profile", require("./src/routes/profile.routes"));
app.use("/api/overview", require("./src/routes/overview.routes"));
//server starting
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
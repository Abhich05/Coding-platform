const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
// const connectDB = require("./src/db/db.js");
const dotenv = require("dotenv")

dotenv.config();

const PORT = process.env.PORT || 5000;

// ❌ removed top-level await (not allowed in CommonJS)

app.use(cors()); 
app.use(express.json()); 
// const authRoutes=require('./routes/auth.routes');


// //main routes 
app.use("/api/auth", require("./src/routes/auth.routes.js")); 

// app.use("/api/profile", require("./routes/profile.routes")); 
// app.use("/api/practice", require("./routes/practice.routes")); 
// app.use("/api/problems", require("./routes/problems.routes")); 
// app.use("/api/tests", require("./routes/tests.routes")); 
app.use("/api/jobs", require("./src/routes/jobs.routes.js"));


//server starting

(async () => {
  try {
    // await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server failed to start");
  }
})();

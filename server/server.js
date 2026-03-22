const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
app.use(cors()); 
app.use(express.json()); 
const authRoutes=require('./routes/auth.routes');

// //main routes 
app.use("/api/auth", require("./routes/auth.routes")); 
// app.use("/api/profile", require("./routes/profile.routes")); 
// app.use("/api/practice", require("./routes/practice.routes")); 
// app.use("/api/problems", require("./routes/problems.routes")); 
// app.use("/api/tests", require("./routes/tests.routes")); 
// app.use("/api/jobs", require("./routes/jobs.routes")); 

//server starting
app.listen(4000, () => console.log("Server running on 4000"));
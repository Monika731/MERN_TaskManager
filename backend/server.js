const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Allow requests from Vercel frontend
const allowedOrigins = ["https://mern-task-manager-45y2rcoy3-monikas-projects-82791be5.vercel.app"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ✅ Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

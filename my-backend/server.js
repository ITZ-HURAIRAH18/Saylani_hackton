import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
// app.use(cors());
app.use(
  cors({
    origin: [
      "https://saylani-hackton-9pw4-awuzbmyao.vercel.app", // your frontend
      "http://localhost:5173", // for local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1); // stop app if DB fails
  }
};
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("DonateHub Backend Running ✅");
});

app.use("/api/auth", authRoutes); // signup/login routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/dashboard", dashboardRoutes);



// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

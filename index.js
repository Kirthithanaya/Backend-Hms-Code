import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import financialRoutes from "./routes/financialRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/resident", residentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/user", userRoutes);
app.use("/api/integration", integrationRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/sms", smsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port `, port);
});

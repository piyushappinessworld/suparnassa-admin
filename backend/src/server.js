require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const { errorHandler } = require("./middleware/error.middleware");
const sendEmail = require("./routes/contact.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.post("/api/send-email", async (req, res) => {
  const formData = req.body;
  const result = await sendEmail(formData);
  if (result.success) {
    res.status(200).send(result.message);
  } else {
    res.status(500).send(result.message);
  }
});

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

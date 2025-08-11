require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const dbCon = require("./app/config/db");

const app = express();

dbCon();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./app/routes/authRoutes"));
app.use("/api/users", require("./app/routes/userRoutes"));
app.use("/api/categories", require("./app/routes/categoryRoutes"));

// Server listen
const port = process.env.PORT || 2809;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

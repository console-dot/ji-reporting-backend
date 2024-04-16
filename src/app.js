// Setup ENV
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
// Required Imports
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { router } = require("./routes");
const { UserModel } = require("./model");
const PORT = process.env.PORT || 5000;

const app = express();
// Middlewares
app.use(express.json());
app.use(cors("*"));
app.use(express.static(path.join(__dirname, "../public")));


// Routes
app.use("/api/v1", router);

// Listener
app.listen(PORT, () => {
  console.log("\x1b[33m%s\x1b[0m", "[!] Connection to database...");
  // Database connection error
  db.on("error", (err) => {
    console.error(err);
  });
});

module.exports = { app };

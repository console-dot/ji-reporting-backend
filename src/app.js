// Setup ENV
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Required Imports
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import the connection
const { router } = require("./routes");
const file = require("express-fileupload");
const { cacheAllData } = require("./utils");
const { CountryModel } = require("./model");
const {
  updateHalqaCountForAllIlaqas,
  updateHalqaCountForAllTehsils,
  updateCountsForAllDivisions,
  updateCountsForAllMaqams,
  updateCountsForAllProvinces,
  updateHalqaCountForAllDistricts,
  updateCountsForCountry,
  findMissing,
  findDisables,
} = require("./provinceAccessList");
const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors("*"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(file());

const initialize = async () => {
  try {
    db.on("error", (error) => {
      console.error("Database connection error:", error);
      process.exit(1);
    });

    db.once("open", async () => {
      console.log("\x1b[32m%s\x1b[0m", "[✔] Connected to database!");

      try {
        await cacheAllData();
        console.log("\x1b[32m%s\x1b[0m", "[✔] Data cached successfully!");
      } catch (error) {
        console.error("Error during caching data:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
};

// Listener
initialize();

// Routes
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `Server running on port ${PORT}`);
});

// updateHalqaCountForAllDistricts();

// main();
// updateHalqaCountForAllIlaqas();
// updateHalqaCountForAllTehsils();
// updateCountsForAllDivisions()
// updateCountsForAllMaqams();
// updateCountsForAllProvinces();
// updateCountsForCountry();

// findMissing();
// findDisables();
module.exports = { app };

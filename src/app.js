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
const { CountryAccessListModel, CountryModel } = require("./model");
const {
  updateHalqaCountForAllIlaqas,
  updateHalqaCountForAllTehsils,
  updateTehsilCountForAllDistricts,
  updateCountsForAllDivisions,
  updateCountsForAllMaqams,
  updateCountsForAllProvinces,
  updateHalqaCountForAllDistricts,
  updateCountsForCountry,
  findmissing,
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

// Routes
app.use("/api/v1", router);

// Listener
initialize();

app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `Server running on port ${PORT}`);
});
async function saveAccessList(accessList) {
  // try {
  //   const countryAccessList = new CountryAccessListModel({
  //     countryAccessList: accessList, // Pass the array of IDs here
  //   });
  //   const savedDocument = await countryAccessList.save();
  //   console.log("Access list saved:", savedDocument);
  // } catch (error) {
  //   console.error("Error saving access list:", error);
  // }
}
// async function main() {
//   await saveAccessList(countryAccessList);
// }

// main();
// updateHalqaCountForAllIlaqas();
// updateHalqaCountForAllTehsils();
// updateHalqaCountForAllDistricts();
// updateCountsForAllDivisions()
// updateCountsForAllMaqams();
// updateCountsForAllProvinces();
// updateCountsForCountry();
findMissing();
// findDisables();
module.exports = { app };

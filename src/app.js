// Setup ENV
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
// Required Imports
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { router } = require("./routes");
const {
  ProvinceModel,
  IlaqaModel,
  HalqaModel,
  MaqamModel,
} = require("./model");
const { maqamFlow } = require("./maqamsFlow");
const PORT = process.env.PORT || 5000;

const app = express();
// Middlewares
app.use(express.json());
app.use(cors("*"));
app.use(express.static(path.join(__dirname, "../public")));
//Maqam Flow

const createMaqamIlaqaUnit = async () => {
  try {
    for (let index = 0; index < maqamFlow.length; index++) {
      let provinceId, maqamId, ilaqaId;
      const obj = maqamFlow[index];
      // create maqam from province
      const existingProvince = await ProvinceModel.findOne({
        name: obj.province,
      });
      const maqamExist = await MaqamModel.findOne({
        name: obj.muqam,
      });
      let nameOfProvinceOfMaqam;
      if (maqamExist) {
        nameOfProvinceOfMaqam = ProvinceModel.findOne({
          _id: maqamExist?.province,
        }).select("name");
        maqamId = maqamExist?._id;
      }
      if (existingProvince && nameOfProvinceOfMaqam === obj.province) {
        provinceId = existingProvince?._id;
        const newMaqam = new MaqamModel({
          name: obj.muqam,
          province: provinceId,
        });
        await newMaqam.save();
        maqamId = newMaqam?._id;
      }
      if (obj?.ilaqa && obj?.muqam) {
        // create ilaqa if maqam and ilaqa both are present
        const existingIlaqa = await IlaqaModel.find({ name: obj?.ilaqa });

        if (existingIlaqa.length > 0) {
          // Flag to track if an appropriate Ilaqa was found
          let foundAppropriateIlaqa = false;

          // Iterate over existing Ilaqas
          for (let ilaqa of existingIlaqa) {
            const maqamOfIlaqa = await MaqamModel.findOne({
              _id: ilaqa.maqam,
            });

            // Check if the maqam of the existing Ilaqa matches the one in the data
            if (maqamOfIlaqa?.name === obj?.muqam) {
              foundAppropriateIlaqa = true;
              break; // Found appropriate Ilaqa, exit loop
            }
          }

          // If no appropriate Ilaqa was found, create a new one
          if (!foundAppropriateIlaqa) {
            const maqam = await MaqamModel.findOne({ name: obj?.muqam });
            const newIlaqa = new IlaqaModel({
              name: obj?.ilaqa,
              maqam: maqam?._id,
            });
            await newIlaqa.save();
          }
        } else {
          // No existing Ilaqa with the same name, create a new one
          const maqam = await MaqamModel.findOne({ name: obj?.muqam });
          const newIlaqa = new IlaqaModel({
            name: obj?.ilaqa,
            maqam: maqam?._id,
          });
          await newIlaqa.save();
        }
      }
      // Check if units are to be created under Ilaqa
      if (obj?.ilaqa && obj?.unit) {
        const ilaqas = await IlaqaModel.find({ name: obj?.ilaqa });
        for (let ilaqa of ilaqas) {
          // Check if the parent maqam of the ilaqa is the same as the one in the data
          const parentMaqam = await MaqamModel.findById(ilaqa.maqam);
          if (parentMaqam?.name === obj.muqam) {
            // Check if the unit already exists under this Ilaqa
            const existingUnit = await HalqaModel.findOne({
              name: obj.unit,
              parentType: "Ilaqa",
              parentId: ilaqa._id,
            });
            if (!existingUnit) {
              // If unit doesn't exist, create it
              const newIaqaUnit = new HalqaModel({
                name: obj.unit,
                parentType: "Ilaqa",
                parentId: ilaqa._id,
                unitType: obj?.unitType, // Consider adding unit type if available
              });
              await newIaqaUnit.save();
            }
          }
        }
      }

      // Check if units are to be created under Maqam
      if (obj?.unit && obj?.muqam && !obj?.ilaqa) {
        // Check if the Maqam exists
        const existingMaqam = await MaqamModel.findOne({
          name: obj?.muqam,
        });
        if (existingMaqam) {
          // Check if the unit already exists under this Maqam
          const halqaExist = await HalqaModel.findOne({
            parentId: existingMaqam._id,
            name: obj?.unit,
          });
          if (!halqaExist) {
            // If unit doesn't exist, create it
            const maqamHalqa = new HalqaModel({
              name: obj?.unit,
              parentId: existingMaqam._id,
              parentType: "Maqam",
              unitType: obj?.unitType,
            });
            await maqamHalqa.save();
          }
        }
      }
    }
    return "The data is created";
  } catch (error) {
    console.error("An error occurred:", error);
    return { error };
  }
};

(async () => {
  const result = await createMaqamIlaqaUnit();
  console.log(result);
})();
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

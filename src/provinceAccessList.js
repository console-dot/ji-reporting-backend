const { mongoose } = require("mongoose");
const {
  IlaqaModel,
  HalqaModel,
  TehsilModel,
  DistrictModel,
  DivisionModel,
  MaqamModel,
  ProvinceModel,
  CountryModel,
} = require("./model");



monthlyReports: {
  month: Date.now();
  provincesFilled: [
    {
      name: { type: String },
      pId: { type: mongoose.Schema.Types.ObjectId, ref: "Province" },
    },
  ];
  provincesUnFilled: [
    {
      name: { type: String },
      pId: { type: mongoose.Schema.Types.ObjectId, ref: "Province" },
    },
  ];
  divisions: [
    {
      name: { type: String },
      dId: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
    },
  ];
  maqams: [
    {
      name: { type: String },
      dId: { type: mongoose.Schema.Types.ObjectId, ref: "Maqam" },
    },
  ];
  ilaqas: [
    {
      name: { type: String },
      dId: { type: mongoose.Schema.Types.ObjectId, ref: "Ilaqa" },
    },
  ];
  halqas: [
    {
      name: { type: String },
      dId: { type: mongoose.Schema.Types.ObjectId, ref: "halqa" },
    },
  ];
}

async function updateHalqaCountForAllIlaqas() {
  try {
    // Fetch all Ilaqas
    const ilaqas = await IlaqaModel.find({});

    if (!ilaqas.length) {
      console.log("No Ilaqas found");
      return;
    }

    for (const ilaqa of ilaqas) {
      // Fetch all Halqas for this Ilaqa (active and inactive)
      const allHalqas = await HalqaModel.find({
        parentType: "Ilaqa",
        parentId: ilaqa._id,
      });

      // Separate Halqas into active and inactive
      const activeHalqas = allHalqas.filter((halqa) => !halqa.disabled);

      // Update childHalqaIDs with all Halqas (both active and inactive)
      ilaqa.childHalqaIDs = allHalqas.map((halqa) => halqa._id);

      // Update activeHalqaCount with the count of active Halqas
      ilaqa.activeHalqaCount = activeHalqas.length;

      // Save the updated Ilaqa
      await ilaqa.save();
    }

    console.log("All Ilaqas updated successfully.");
  } catch (error) {
    console.error("Error updating childHalqaIDs and activeHalqaCount:", error);
  }
}

async function updateHalqaCountForAllTehsils() {
  try {
    // Fetch all Tehsil documents
    const tehsils = await TehsilModel.find({});

    if (!tehsils.length) {
      console.log("No Tehsils found.");
      return;
    }

    for (const tehsil of tehsils) {
      // Fetch all Halqas for the current Tehsil (both active and inactive)
      const allHalqas = await HalqaModel.find({
        parentType: "Tehsil",
        parentId: tehsil._id,
      });

      // Separate active Halqas (disabled = false)
      const activeHalqas = allHalqas.filter((halqa) => !halqa.disabled);

      // Update the Tehsil document with child Halqa IDs and active Halqa count
      tehsil.childHalqaIDs = allHalqas.map((halqa) => halqa._id); // Store all Halqa IDs
      tehsil.activeHalqaCount = activeHalqas.length; // Count of active Halqas

      // Save the updated Tehsil document
      await tehsil.save();

      console.log(
        `Updated Tehsil "${tehsil.name}": ${activeHalqas.length} active Halqas out of ${allHalqas.length} total Halqas.`
      );
    }

    console.log("All Tehsil documents updated successfully.");
  } catch (error) {
    console.error("Error updating Tehsil documents:", error);
  }
}

async function updateHalqaCountForAllDistricts() {
  try {
    // Step 1: Retrieve all District documents (no filter for disabled districts)
    const districts = await DistrictModel.find({});

    if (!districts.length) {
      console.log("No Districts found.");
      return;
    }

    // Step 2: Loop over each District and update its halqaCount
    for (const district of districts) {
      // Step 3: Fetch all Tehsils under the current District (no filter for disabled)
      const allTehsils = await TehsilModel.find({
        district: district._id,
      });

      if (!allTehsils.length) {
        console.log(`No Tehsils found for District with _id ${district._id}`);
        continue;
      }

      // Step 4: Aggregate Halqa IDs from all Tehsils (irrespective of `disabled` status)
      let halqaIDs = [];

      for (const tehsil of allTehsils) {
        // Add Halqa IDs from the Tehsil (active and inactive Tehsils)
        halqaIDs = [...halqaIDs, ...tehsil.halqaIDs];
      }

      // Step 5: Fetch active Halqas from the DB
      const activeHalqas = await HalqaModel.find({
        _id: { $in: halqaIDs }, // Only Halqas that belong to the current District
        disabled: false, // Active Halqas only
      });

      // Step 6: Calculate the halqaCount (active Halqas only)
      const totalHalqaCount = activeHalqas.length;

      // Step 7: Filter only active Tehsils for tehsilCount
      const activeTehsils = allTehsils.filter((tehsil) => !tehsil.disabled);

      // Step 8: Verify tehsilCount by checking active Tehsils in DB
      const activeTehsilCountInDB = await TehsilModel.countDocuments({
        district: district._id,
        disabled: false,
      });

      if (activeTehsils.length !== activeTehsilCountInDB) {
        console.log(
          `Tehsil count mismatch for District ${district._id}: Expected ${activeTehsils.length}, Found ${activeTehsilCountInDB}`
        );
      }

      // Step 9: Verify halqaCount by checking active Halqas in DB
      const halqaCountInDB = await HalqaModel.countDocuments({
        _id: { $in: halqaIDs },
        disabled: false,
      });

      if (totalHalqaCount !== halqaCountInDB) {
        console.log(
          `Halqa count mismatch for District ${district._id}: Expected ${totalHalqaCount}, Found ${halqaCountInDB}`
        );
      }

      // Step 10: Save the Tehsil IDs (all Tehsils, active and inactive), active Tehsil count, and active halqaCount
      district.tehsilIDs = allTehsils.map((tehsil) => tehsil._id); // All Tehsil IDs (active + inactive)
      district.tehsilCount = activeTehsils.length; // Count of active Tehsils
      district.halqaIDs = halqaIDs; // All Halqa IDs (active + inactive)
      district.halqaCount = totalHalqaCount; // Total count of active Halqas

      // Step 11: Save the updated District
      await district.save();

      console.log(
        `Updated District with _id ${district._id}: halqaCount = ${totalHalqaCount}, tehsilCount = ${activeTehsils.length}`
      );
    }

    console.log("All Districts updated successfully.");
  } catch (error) {
    console.error(
      "Error updating halqaCount and halqaIDs for all Districts:",
      error
    );
  }
}

async function updateCountsForAllDivisions() {
  try {
    const divisions = await DivisionModel.find({});

    if (!divisions.length) {
      console.log("No divisions found.");
      return;
    }

    for (const division of divisions) {
      let childHalqaIDs = [];
      let childTehsilIDs = [];
      let childDistrictIDs = [];
      let activeHalqaCount = 0;
      let activeTehsilCount = 0;
      let activeDistrictCount = 0;

      // Check for direct Halqas in the Division
      const directHalqas = await HalqaModel.find({
        parentType: "Division",
        parentId: division._id,
      });

      if (directHalqas.length > 0) {
        // Process direct Halqas
        childHalqaIDs = directHalqas.map((halqa) => halqa._id);
        activeHalqaCount = directHalqas.filter(
          (halqa) => !halqa.disabled
        ).length;
      } else {
        // Process Districts, Tehsils, and Halqas within the hierarchy
        const districts = await DistrictModel.find({ division: division._id });
        if (districts.length > 0) {
          childDistrictIDs = districts.map((district) => district._id);
          activeDistrictCount = districts.filter(
            (district) => !district.disabled
          ).length;

          for (const district of districts) {
            const tehsils = await TehsilModel.find({ district: district._id });
            childTehsilIDs.push(...tehsils.map((tehsil) => tehsil._id));
            activeTehsilCount += tehsils.filter(
              (tehsil) => !tehsil.disabled
            ).length;

            for (const tehsil of tehsils) {
              const halqas = await HalqaModel.find({
                parentType: "Tehsil",
                parentId: tehsil._id,
              });
              childHalqaIDs.push(...halqas.map((halqa) => halqa._id));
              activeHalqaCount += halqas.filter(
                (halqa) => !halqa.disabled
              ).length;
            }
          }
        }
      }

      // Update division document with aggregated data
      division.childDistrictIDs = childDistrictIDs; // Store all district IDs
      division.childTehsilIDs = childTehsilIDs; // Store all tehsil IDs
      division.childHalqaIDs = childHalqaIDs; // Store all halqa IDs

      division.activeDistrictCount = activeDistrictCount; // Active district count
      division.activeTehsilCount = activeTehsilCount; // Active tehsil count
      division.activeHalqaCount = activeHalqaCount; // Active halqa count

      await division.save();

      console.log(
        `Updated Division "${division.name}" with ${activeHalqaCount} active Halqas, ${activeTehsilCount} active Tehsils, and ${activeDistrictCount} active Districts.`
      );
    }

    console.log("All divisions have been updated successfully.");
  } catch (error) {
    console.error("Error updating counts for divisions:", error);
  }
}

async function updateCountsForAllMaqams() {
  try {
    const maqams = await MaqamModel.find();

    if (!maqams.length) {
      console.log("No Maqams found.");
      return;
    }

    for (const maqam of maqams) {
      let childHalqaIDs = [];
      let activeHalqaCount = 0;
      let activeIlaqaCount = 0;

      // Step 1: Fetch and process Ilaqas associated with this Maqam
      const allIlaqas = await IlaqaModel.find({ maqam: maqam._id });
      const activeIlaqas = allIlaqas.filter((ilaqa) => !ilaqa.disabled);
      activeIlaqaCount = activeIlaqas.length;

      // Step 2: Collect Halqas from each Ilaqa
      for (const ilaqa of allIlaqas) {
        const halqasFromIlaqa = await HalqaModel.find({
          parentType: "Ilaqa",
          parentId: ilaqa._id,
        });

        childHalqaIDs.push(...halqasFromIlaqa.map((halqa) => halqa._id));
        activeHalqaCount += halqasFromIlaqa.filter(
          (halqa) => !halqa.disabled
        ).length;
      }

      // Step 3: Fetch active Halqas directly linked to this Maqam
      const directHalqas = await HalqaModel.find({
        parentType: "Maqam",
        parentId: maqam._id,
      });

      // Separate active direct Halqas
      const activeDirectHalqas = directHalqas.filter(
        (halqa) => !halqa.disabled
      );
      const activeDirectHalqaCount = activeDirectHalqas.length;

      // Combine Halqa data from Ilaqas and direct Halqas
      childHalqaIDs.push(...directHalqas.map((halqa) => halqa._id));
      activeHalqaCount += activeDirectHalqaCount;

      // Update Maqam with the aggregated data
      maqam.childIlaqaIDs = allIlaqas.map((ilaqa) => ilaqa._id); // Store all Ilaqa IDs
      maqam.childHalqaIDs = childHalqaIDs; // Store all Halqa IDs

      maqam.activeIlaqaCount = activeIlaqaCount; // Active Ilaqa count
      maqam.activeHalqaCount = activeHalqaCount; // Active Halqa count

      // Save the updated Maqam
      await maqam.save();

      console.log(
        `Updated Maqam "${maqam.name}" with ${activeHalqaCount} active Halqas and ${activeIlaqaCount} active Ilaqas.`
      );
    }

    console.log("All Maqams updated successfully.");
  } catch (error) {
    console.error("Error updating counts for Maqams:", error);
  }
}

async function updateCountsForAllProvinces() {
  try {
    // Fetch all provinces
    const provinces = await ProvinceModel.find();

    if (!provinces.length) {
      console.log("No provinces found.");
      return;
    }

    for (const province of provinces) {
      // Initialize arrays to collect IDs
      let allHalqaIDs = [];
      let allIlaqaIDs = [];
      let allDistrictIDs = [];
      let allTehsilIDs = [];

      // Initialize counters for each entity type
      let activeHalqaCount = 0;
      let activeIlaqaCount = 0;
      let activeDistrictCount = 0;
      let activeTehsilCount = 0;

      // Fetch all Divisions and Maqams associated with this Province
      const allDivisions = await DivisionModel.find({ province: province._id });
      const allMaqams = await MaqamModel.find({ province: province._id });

      // Collect child IDs and aggregate counts from Divisions
      for (const division of allDivisions) {
        allHalqaIDs.push(...division.childHalqaIDs);
        allDistrictIDs.push(...division.childDistrictIDs);
        allTehsilIDs.push(...division.childTehsilIDs);

        // Sum active counts (no `disabled` check)
        activeHalqaCount += division.activeHalqaCount || 0;
        activeDistrictCount += division.activeDistrictCount || 0;
        activeTehsilCount += division.activeTehsilCount || 0;
      }

      // Collect child IDs and aggregate counts from Maqams
      for (const maqam of allMaqams) {
        allHalqaIDs.push(...maqam.childHalqaIDs);
        allIlaqaIDs.push(...maqam.childIlaqaIDs);

        // Sum active counts (no `disabled` check)
        activeHalqaCount += maqam.activeHalqaCount || 0;
        activeIlaqaCount += maqam.activeIlaqaCount || 0;
      }

      // Update Province document with combined IDs and counts
      province.childHalqaIDs = allHalqaIDs;
      province.childIlaqaIDs = allIlaqaIDs;
      province.childDistrictIDs = allDistrictIDs;
      province.childTehsilIDs = allTehsilIDs;

      // Update aggregated counts
      province.activeHalqaCount = activeHalqaCount;
      province.activeIlaqaCount = activeIlaqaCount;
      province.activeDistrictCount = activeDistrictCount;
      province.activeTehsilCount = activeTehsilCount;

      // Additional section to calculate active Maqam and Division counts
      const activeMaqams = await MaqamModel.find({
        province: province._id,
        disabled: false,
      });
      const activeDivisions = await DivisionModel.find({
        province: province._id,
        disabled: false,
      });
      province.childMaqamIDs = allMaqams.map((maqam) => maqam._id); // Correct for Maqams
      province.childDivisionIDs = allDivisions.map((division) => division._id); // Correct for Divisions

      // Save active counts
      province.activeMaqamCount = activeMaqams.length;
      province.activeDivisionCount = activeDivisions.length;
      // Save the updated Province
      await province.save();

      console.log(`Updated Province ${province.name}`);
    }

    console.log("All Provinces updated successfully.");
  } catch (error) {
    console.error("Error updating counts and IDs for all Provinces:", error);
  }
}

async function updateCountsForCountry() {
  try {
    // Fetch all countries
    const countries = await CountryModel.find();

    if (!countries.length) {
      console.log("No countries found.");
      return;
    }

    for (const country of countries) {
      // Fetch all Provinces belonging to this Country
      const provinces = await ProvinceModel.find({
        country: country._id,
        disabled: false,
      }); // Ensure only active provinces are fetched

      // Initialize counters and arrays
      let totalActiveHalqaCount = 0;
      let totalActiveIlaqaCount = 0;
      let totalActiveDistrictCount = 0;
      let totalActiveTehsilCount = 0;
      let totalActiveDivisionCount = 0;
      let totalActiveMaqamCount = 0;

      let allHalqaIDs = [];
      let allIlaqaIDs = [];
      let allDistrictIDs = [];
      let allTehsilIDs = [];
      let allDivisionIDs = [];
      let allMaqamIDs = [];
      let provinceIDs = [];

      for (const province of provinces) {
        // Sum up the counts from each province
        totalActiveHalqaCount += province.activeHalqaCount || 0;
        totalActiveIlaqaCount += province.activeIlaqaCount || 0;
        totalActiveDistrictCount += province.activeDistrictCount || 0;
        totalActiveTehsilCount += province.activeTehsilCount || 0;
        totalActiveDivisionCount += province.activeDivisionCount || 0;
        totalActiveMaqamCount += province.activeMaqamCount || 0;

        // Collect IDs from each province
        allHalqaIDs.push(...province.childHalqaIDs);
        allIlaqaIDs.push(...province.childIlaqaIDs);
        allDistrictIDs.push(...province.childDistrictIDs);
        allTehsilIDs.push(...province.childTehsilIDs);
        allDivisionIDs.push(...province.childDivisionIDs);
        allMaqamIDs.push(...province.childMaqamIDs);
        provinceIDs.push(province._id);
      }

      // Update the Country document with aggregated counts and IDs
      country.activeHalqaCount = totalActiveHalqaCount;
      country.activeIlaqaCount = totalActiveIlaqaCount;
      country.activeDistrictCount = totalActiveDistrictCount;
      country.activeTehsilCount = totalActiveTehsilCount;
      country.activeDivisionCount = totalActiveDivisionCount;
      country.activeMaqamCount = totalActiveMaqamCount;

      country.childHalqaIDs = allHalqaIDs;
      country.childIlaqaIDs = allIlaqaIDs;
      country.childDistrictIDs = allDistrictIDs;
      country.childTehsilIDs = allTehsilIDs;
      country.childDivisionIDs = allDivisionIDs;
      country.childMaqamIDs = allMaqamIDs;
      country.childProvinceIDs = provinceIDs;

      // Save the updated Country document
      await country.save();
      console.log(`Updated counts for Country: ${country.name}`);
    }

    console.log("All countries updated successfully.");
  } catch (error) {
    console.error("Error updating counts for countries:", error);
  }
}

async function findMissing() {
  try {
    // Fetch active districts from the District table
    const districts = await DistrictModel.find({ disabled: false }).exec();
    const districtIDsInDB = districts.map((district) =>
      district._id.toString()
    );

    // Find the country document (assuming we're working with the first country)
    const foundCountry = await CountryModel.find({});
    const countryId = foundCountry[0]._id;
    const country = await CountryModel.findById(countryId);

    if (!country) {
      console.log("Country not found.");
      return;
    }

    // Get district IDs from the country model
    const districtIDsInCountry = country.districtIDs.map((id) => id.toString());

    console.log("District IDs in DB: ", districtIDsInDB.length);
    console.log("District IDs in Country Model: ", districtIDsInCountry.length);

    // Compare the two arrays for districts
    const missingInCountry = districtIDsInDB.filter(
      (id) => !districtIDsInCountry.includes(id)
    );
    const missingInDB = districtIDsInCountry.filter(
      (id) => !districtIDsInDB.includes(id)
    );

    if (missingInCountry.length) {
      console.log("Missing district IDs in Country Model: ", missingInCountry);
    } else {
      console.log("No missing district IDs in Country Model.");
    }

    if (missingInDB.length) {
      console.log("Missing district IDs in DB: ", missingInDB);
    } else {
      console.log("No missing district IDs in DB.");
    }

    // ================== New Code for Ilaqa and Halqa Summation ====================
    // Fetch all Ilaqas
    const ilaqas = await IlaqaModel.find({});

    // Sum all Halqa IDs from Ilaqas
    const halqaIDsFromIlaqas = ilaqas.flatMap((ilaqa) =>
      ilaqa.halqaIDs.map((id) => id.toString())
    );
    const halqaIDsFromIlaqasSet = new Set(halqaIDsFromIlaqas);

    // Fetch all Halqas directly from the database
    const halqasInDB = await HalqaModel.find({ parentType: "Ilaqa" });
    const halqaIDsInDB = halqasInDB.map((halqa) => halqa._id.toString());

    console.log(
      "Total Halqa IDs from Ilaqas: ",
      halqaIDsFromIlaqas.length,
      `(Unique: ${halqaIDsFromIlaqasSet.size})`
    );
    console.log("Total Halqa IDs in DB: ", halqaIDsInDB.length);

    // Compare Halqa IDs between Ilaqas and DB
    const missingInIlaqas = halqaIDsInDB.filter(
      (id) => !halqaIDsFromIlaqasSet.has(id)
    );
    const missingInDBHalqas = [...halqaIDsFromIlaqasSet].filter(
      (id) => !halqaIDsInDB.includes(id)
    );

    if (missingInIlaqas.length) {
      console.log(
        "Halqa IDs in DB but not in Ilaqas: ",
        missingInIlaqas.length,
        missingInIlaqas
      );
    } else {
      console.log("No missing Halqa IDs in Ilaqas.");
    }

    if (missingInDBHalqas.length) {
      console.log(
        "Halqa IDs in Ilaqas but not in DB: ",
        missingInDBHalqas.length,
        missingInDBHalqas
      );
    } else {
      console.log("No missing Halqa IDs in DB.");
    }
    // ================== End of New Code ====================

    // Optionally, you can return the missing IDs to handle them as needed.
    return {
      missingInCountry,
      missingInDB,
      missingInIlaqas,
      missingInDBHalqas,
    };
  } catch (error) {
    console.error("Error finding missing halqas or districts:", error);
  }
}

async function findDisables() {
  try {
    // Fetch all active Maqams
    let halqaFoundWithMaqamId = [];
    let halqasDirctToMaqam = [];
    const maqams = await MaqamModel.find({ disabled: false });

    if (!maqams.length) {
      console.log("No Maqams found.");
      return;
    }

    const halqaDirectToMaqam = await HalqaModel.find({
      parentType: "Maqam",
      disabled: false,
    });

    // Extract only the _id values from the `halqaDirectToMaqam` array
    halqasDirctToMaqam = halqaDirectToMaqam;

    console.log(
      `Found ${halqasDirctToMaqam.length} Halqas directly associated with Maqam`
    );

    for (const maqam of maqams) {
      // Fetch all non-disabled Halqas associated with this Maqam
      const halqas = await HalqaModel.find({
        parentType: "Maqam",
        parentId: maqam._id,
        disabled: false, // Only non-disabled Halqas
      });

      console.log(`Found ${halqas.length} Halqas for Maqam ${maqam._id}`);

      if (halqas && halqas.length > 0) {
        // Push the whole halqa object into the array
        halqaFoundWithMaqamId.push(...halqas);
      }
    }

    // Convert halqa _id's to string for both arrays
    const halqasDirctToMaqamIds = halqasDirctToMaqam.map((halqa) =>
      halqa._id.toString()
    ); // Convert _id to string
    const halqaFoundWithMaqamIdSet = new Set(
      halqaFoundWithMaqamId.map((halqa) => halqa._id.toString())
    ); // Create a Set of strings

    console.log(`halqasDirctToMaqamIds: ${halqasDirctToMaqamIds}`);
    console.log(`halqaFoundWithMaqamIdSet: ${[...halqaFoundWithMaqamIdSet]}`);

    // Find unique _id's in halqasDirctToMaqam that are not in halqaFoundWithMaqamId
    const uniqueInMaqam = halqasDirctToMaqamIds.filter(
      (id) => !halqaFoundWithMaqamIdSet.has(id)
    );

    // Log the result
    console.log(
      `Found ${uniqueInMaqam.length} unique Halqas that are not in halqaFoundWithMaqamId.`
    );

    // Log the details of the missing Halqas
    uniqueInMaqam.forEach((id) => {
      const missingHalqa = halqasDirctToMaqam.find(
        (halqa) => halqa._id.toString() === id
      );
      if (missingHalqa) {
        console.log("Missing Halqa:", missingHalqa); // Log the entire missing halqa object
      }
    });
  } catch (error) {
    console.error("Error finding missing Halqas:", error);
  }
}

module.exports = {
  updateHalqaCountForAllIlaqas,
  updateHalqaCountForAllTehsils,
  updateHalqaCountForAllDistricts,
  updateCountsForAllDivisions,
  updateCountsForAllMaqams,
  updateCountsForAllProvinces,
  updateCountsForCountry,
  findMissing,
  findDisables,
};

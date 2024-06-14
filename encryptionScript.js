const CryptoJS = require("crypto-js");
const { UserModel } = require("./src/model");

const encryptData = async () => {
  const secretKey = "1122";

  const isEncrypted = (data) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(data, secretKey).toString(
        CryptoJS.enc.Utf8
      );
      return decrypted.length > 0;
    } catch (e) {
      return false;
    }
  };

  const encryptField = (field) => {
    if (field && !isEncrypted(field)) {
      return CryptoJS.AES.encrypt(field, secretKey).toString();
    }
    return field;
  };

  // Fetch user data from the database
  const users = await UserModel.find();

  if (users?.length > 0) {
    for (const user of users) {
      const updatedFields = {};

      const address = encryptField(user?.address);
      const phoneNumber = encryptField(user?.phoneNumber);
      const whatsAppNumber = encryptField(user?.whatsAppNumber);

      if (address !== user?.address) updatedFields.address = address;
      if (phoneNumber !== user?.phoneNumber)
        updatedFields.phoneNumber = phoneNumber;
      if (whatsAppNumber !== user?.whatsAppNumber)
        updatedFields.whatsAppNumber = whatsAppNumber;

      // Update the user in the database if there are fields to update
      if (Object.keys(updatedFields).length > 0) {
        await UserModel.updateOne({ _id: user._id }, { $set: updatedFields });
      }
    }
  }
};

module.exports = {
  encryptData,
};

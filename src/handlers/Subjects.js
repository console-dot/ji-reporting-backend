const { SubjectModal } = require("../model");
const Response = require("./Response");

class Subject extends Response {
  create = async (req, res) => {
    try {
      const { title } = req.body;
      if (!title || typeof title !== "string") {
        return this.sendResponse(req, res, {
          message: "Title is required!",
          status: 400,
        });
      }
      const sanitizedTitle = title.trim().toLowerCase().split(" ").join("_");
      const normalizedTitle = title.trim().toLowerCase().split(" ").join("");
      const valid = [sanitizedTitle, normalizedTitle];
      const titleExist = await SubjectModal.find({});
      let isValid = true;
      titleExist
        .map((i) => i?.title?.trim().toLowerCase().split("_").join(""))
        .forEach((t) => {
          if (valid.includes(t)) {
            isValid = false;
          }
        });
      if (!isValid) {
        return this.sendResponse(req, res, {
          message: "Subject already exist!",
          status: 400,
        });
      }
      const subject = new SubjectModal({
        title: sanitizedTitle,
      });
      await subject.save();
      return this.sendResponse(req, res, {
        message: "Subject added",
        status: 201,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "INTERNAL SERVER ERROR",
        status: 500,
      });
    }
  };
  getSubjects = async (req, res) => {
    try {
      const subjects = await SubjectModal.find({});
      if (!subjects) {
        return this.sendResponse(req, res, {
          message: "No subject is added before",
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Subjects fetched",
        status: 200,
        data: subjects,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "INTERNAL SERVER ERROR",
        status: 500,
      });
    }
  };
  getSubject = async (req, res) => {
    try {
      const { id } = req.body;
      const subject = await SubjectModal.find({ id });
      if (!subject) {
        return this.sendResponse(req, res, {
          message: "No subject is added before",
          status: 200,
        });
      }
      return this.sendResponse(req, res, {
        message: "Subjects fetched",
        status: 200,
        data: subject,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "INTERNAL SERVER ERROR",
        status: 500,
      });
    }
  };
  updateSubjects = async (req, res) => {
    try {
      const { id, newTitle } = req.body;
      if (!newTitle || typeof newTitle !== "string") {
        return this.sendResponse(req, res, {
          message: "Title is required!",
          status: 400,
        });
      }
      const sanitizedTitle = newTitle.trim().toLowerCase().split(" ").join("_");
      const subExist = await SubjectModal.find({ _id: id });
      if (!subExist) {
        return this.sendResponse(req, res, {
          message: "Subject not found with this id",
          status: 404,
        });
      }

      const update = await SubjectModal.updateOne({
        _id: id,
        title: sanitizedTitle,
      });
      if (update.modifiedCount > 0) {
        return this.sendResponse(req, res, {
          message: "Subject is updated",
          status: 200,
        });
      }
      if (update.matchedCount === 1 && update.modifiedCount === 0) {
        return this.sendResponse(req, res, {
          message: "Subject already modified",
          status: 400,
        });
      }
      return this.sendResponse(req, res, {
        message: "Internal server error",
        status: 500,
      });
    } catch (error) {
      console.log(error);
      return this.sendResponse(req, res, {
        message: "INTERNAL SERVER ERROR",
        status: 500,
      });
    }
  };
  // deleteSubjects = async (req, res) => {
  //   try {
  //     const { subId } = req.body;
  //     if (!newTitle || typeof newTitle !== "string") {
  //       return this.sendResponse(req, res, {
  //         message: "Title is required!",
  //         status: 400,
  //       });
  //     }
  //     const sanitizedTitle = newTitle.trim().toLowerCase().split(" ").join("_");
  //     const subExist = await SubjectModal.find({ _id: subId });
  //     if (!subExist) {
  //       return this.sendResponse(req, res, {
  //         message: "Subject not found with this id",
  //         status: 404,
  //       });
  //     }

  //     const update = await SubjectModal.updateOne({
  //       _id: subId,
  //       title: sanitizedTitle,
  //     });
  //     if (update.modifiedCount > 0) {
  //       return this.sendResponse(req, res, {
  //         message: "Subject is updated",
  //         status: 200,
  //       });
  //     }

  //     return this.sendResponse(req, res, {
  //       message: "Internal server error",
  //       status: 500,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return this.sendResponse(req, res, {
  //       message: "INTERNAL SERVER ERROR",
  //       status: 500,
  //     });
  //   }
  // };
}
module.exports = Subject;

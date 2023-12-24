const httpStatus = require("http-status");
const { Task: Model } = require("../../models");
const MESSAGE = require("../../config/message");
const ObjectId = require("mongoose").Types.ObjectId;

// user list which are not friend

const list = async (req, res) => {
  // const userId = req.user.id;
  // const userId = ObjectId("639c546b085815f44ccbbbd1");
  try {
    const projectInstans = await Model.find()
      .populate({ path: "user", select: "userName" })
      .select("id taskName");

    return res.status(httpStatus.OK).send({
      data: projectInstans,
      success: true,
      message: MESSAGE.retrieve_success,
    });
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
      success: false,
      data: {},
    });
  }
};

// mutual friend list

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const projectInstans = await Model.findById({ _id: id })
      // .populate({ path: "user", select: "userName" })
      .select("id taskName logs");
    return res.status(httpStatus.OK).send({
      data: projectInstans,
      success: true,
      message: MESSAGE.retrieve_success,
    });
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
      success: false,
      data: {},
    });
  }
};

module.exports = {
  list,
  getById,
};

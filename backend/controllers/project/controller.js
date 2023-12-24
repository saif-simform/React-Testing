const httpStatus = require("http-status");
const { Project: Model } = require("../../models");
const MESSAGE = require("../../config/message");
const ObjectId = require("mongoose").Types.ObjectId;

// user list which are not friend

const list = async (req, res) => {
  const userId = req.user.id;
  // const userId = ObjectId("639c546b085815f44ccbbbd1");
  try {
    const projectInstans = await Model.find({
      users: { $in: [userId] },
    }).select("id projectName description");

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
      .populate([{ path: "tasks", select: "taskName" }])
      .select("id projectName tasks");

    // const requestInstance = await Request.findOne({ user: id });

    // const requestFriend = requestInstance?.friends || [];
    // const userFriends = userInstance?.friends || [];

    // const mutualInstance = await Promise.all(
    //   userFriends.filter((e) => {
    //     let id = e._id.toString();
    //     return requestFriend.indexOf(id) > -1;
    //   })
    // );
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

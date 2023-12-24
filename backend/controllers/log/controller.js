const httpStatus = require("http-status");
const moment = require("moment");
const { Logs: Model, Task } = require("../../models");
const MESSAGE = require("../../config/message");
const { parseTime, getWeekRange, getDateRange } = require("../../config/utils");

/**
 * Create a Logs
 * @param {Object} body
 * @returns {Promise<Logs>}
 */
const create = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  data.user = userId;
  const startTime = moment(data.startTime).format("HH:mm:ss");
  const endTime = moment(data.endTime).format("HH:mm:ss");
  const duration = (parseTime(endTime) - parseTime(startTime)) / 60;
  data.duration = duration;
  const logInstace = await Model.create(data);

  const taskInstance = await Task.findById({ _id: data.task });
  taskInstance.logs.push(logInstace._id);
  taskInstance.save();

  return res.status(httpStatus.CREATED).send({
    message: MESSAGE.create_success,
    success: true,
    data: {},
  });
};

/**
 * Update Logs by id
 * @param {ObjectId} id
 * @param {Object} body
 * @returns {Promise<Logs>}
 */
const edit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const body = req.body;
    body.user = userId;
    body.updatedBy = req.user.id;
    const startTime = moment(body.startTime).format("HH:mm:ss");
    const endTime = moment(body.endTime).format("HH:mm:ss");
    const duration = (parseTime(endTime) - parseTime(startTime)) / 60;

    // data.startTime = moment(currentDate).format("YYYY-MM-DD") + data.startTime;
    // data.endTime = moment(currentDate).format("YYYY-MM-DD") + data.endTime;
    body.duration = duration;
    const data = await Model.findByIdAndUpdate(id, { $set: body });
    return res
      .status(httpStatus.OK)
      .send({ data, message: MESSAGE.edit_success });
  } catch (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: MESSAGE.invalid_id });
  }
};

const list = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const taskInstance = await Model.find({
      task: id,
      user: userId,
    })
      .populate([{ path: "task", select: "taskName" }])
      .select("id date startTime endTime duration status comment");
    return res.status(httpStatus.OK).send({
      data: taskInstance,
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

// Logs data based on filter

const getFilterLogsData = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const userId = req.user.id;
    let dateRangeArray =
      type === "Month"
        ? getDateRange(new Date(startDate), new Date(endDate))
        : getWeekRange(new Date(startDate), new Date(endDate));
    let rangeArray = [];
    let logData = [];
    for (const iterator of dateRangeArray) {
      const logsInstance = await Model.find({
        date: {
          $gte: iterator.firstDay,
          $lte: iterator.lastDay,
        },
        user: userId,
      })
        .populate({ path: "task", select: "taskName" })
        .select("_id startTime endTime duration comment status");
      const totalDuration = logsInstance
        .map((el) => {
          return el.duration;
        })
        .reduce((acc, val) => {
          return acc + val;
        }, 0);
      totalDuration > 0 &&
        rangeArray.push({
          duration: totalDuration,
          date: `${moment(iterator.firstDay).format("LLLL")} - ${moment(
            iterator.lastDay
          ).format("LLLL")}`,
        });
      const rangeData = logsInstance;
      logData = [...logData, ...rangeData];
    }

    return res.status(httpStatus.OK).send({
      data: { rangeData: rangeArray, logData: logData },
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

const logList = async (req, res) => {
  try {
    const taskInstance = await Model.find({})
      .populate([{ path: "task", select: "taskName" }])
      .select("id date startTime endTime duration status comment");

    return res.status(httpStatus.OK).send({
      data: taskInstance,
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

const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug } = req.body;
    const instance = await Model.findById(id);
    if (!instance) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: MESSAGE.invalid_id,
        success: false,
        data: {},
      });
    }
    instance.status = slug;
    instance.updatedBy = req.user.id;
    await instance.save();
    return res.status(httpStatus.OK).send({ message: MESSAGE.update_success });
  } catch {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: MESSAGE.invalid_id });
  }
};
module.exports = {
  create,
  edit,
  list,
  getFilterLogsData,
  logList,
  changeStatus,
};

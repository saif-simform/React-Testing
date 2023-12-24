const { toJSON } = require("./plugins");
const mongoose = require("mongoose");
const { DB_MODEL_REF, LOGS_STATUS } = require("../config/constant");

const schema = new mongoose.Schema(
  {
    task: {
      type: mongoose.SchemaTypes.String,
      ref: DB_MODEL_REF.TASK,
    },
    date: { type: Date, default: "" },
    startTime: { type: String, default: 0 },
    endTime: { type: String, default: 0 },
    duration: { type: Number, default: 0 },
    comment: { type: String, default: "" },
    status: {
      type: String,
      enum: [LOGS_STATUS.PENDING, LOGS_STATUS.APPROVED, LOGS_STATUS.DECLINE],
      default: LOGS_STATUS.PENDING,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: DB_MODEL_REF.USER,
    },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
schema.plugin(toJSON);

const Logs = mongoose.model(DB_MODEL_REF.LOGS, schema);
module.exports = Logs;

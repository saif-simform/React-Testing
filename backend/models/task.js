const { toJSON } = require("./plugins");
const mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../config/constant");

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.SchemaTypes.String,
    },
    taskName: { type: String, default: "", required: true },
    logs: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: DB_MODEL_REF.LOGS,
      },
    ],
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

const Task = mongoose.model(DB_MODEL_REF.TASK, schema);
module.exports = Task;

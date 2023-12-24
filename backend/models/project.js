const { toJSON } = require("./plugins");
const mongoose = require("mongoose");
const { DB_MODEL_REF } = require("../config/constant");

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.SchemaTypes.String,
    },
    projectName: { type: String, default: "", required: true },
    description: { type: String, default: "" },
    users: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: DB_MODEL_REF.USER,
      },
    ],
    tasks: [
      {
        type: mongoose.SchemaTypes.String,
        ref: DB_MODEL_REF.TASK,
      },
    ],
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
schema.plugin(toJSON);

const Project = mongoose.model(DB_MODEL_REF.PROJECT, schema);
module.exports = Project;

const USER_FIELDS = ["id", "userName", "firstName", "lastName", "email","isSuperUser"];

const DB_MODEL_REF = {
  USER: "users",
  PROJECT: "project",
  TASK: "task",
  LOGS: "Logs",
};

const LOGS_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  DECLINE: "decline",
};

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const APP_NAME = "Time_Tracking";

module.exports = {
  APP_NAME,
  DB_MODEL_REF,
  EMAIL_REGEX,
  USER_FIELDS,
  LOGS_STATUS,
};

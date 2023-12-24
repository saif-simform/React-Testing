const { Joi } = require("express-validation");

module.exports = {
  create: {
    body: Joi.object({
      task: Joi.number().required(),
      date: Joi.date().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
      status: Joi.string().required(),
      comment: Joi.string().required(),
    }),
  },
};

const { Joi } = require("express-validation");
const { EMAIL_REGEX } = require("../../config/constant");

module.exports = {
  signup: {
    body: Joi.object({
      userName: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().regex(EMAIL_REGEX).required().messages({
        "string.pattern.base": "Invalid Email",
      }),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  
};

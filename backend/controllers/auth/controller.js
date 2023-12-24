const { User: Model } = require("../../models");
const httpStatus = require("http-status");
const { generateAuthTokens } = require("../../services/token.service");
const MESSAGE = require("../../config/message");
const { USER_FIELDS } = require("../../config/constant");

/**
 * Create a User
 * @param {Object} body
 * @returns {Promise<User>}
 */

const signup = async (req, res) => {
  const data = req.body;
  // console.log("data",data)
  // to verify user email
  if (await Model.isEmailExists(data.email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: MESSAGE.email_exists, success: false, data: {} });
  }
  if (data.password !== data.confirmPassword) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: MESSAGE.password_not_matched });
  }

  const user = await Model.create(data);
  const userFields = {};
  USER_FIELDS.map((obj) => (userFields[obj] = user[obj]));
  return res.status(httpStatus.CREATED).send({
    message: MESSAGE.signup_success,
    success: true,
    data: { user: userFields },
  });
};

// User Login

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Model.findOne({ email });
  if (!user || !(await user.checkPassword(password))) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: MESSAGE.invalid_credentials });
  }

  const token = await generateAuthTokens(user.id);
  const data = {};
  USER_FIELDS.map((obj) => (data[obj] = user[obj]));
  return res.status(httpStatus.OK).send({
    user: data,
    token,
    message: MESSAGE.login_success,
    success: true,
  });
};

module.exports = {
  signup,
  login,
};

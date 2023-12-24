const httpStatus = require("http-status");
const { verifyToken } = require("../services/token.service");
const MESSAGE = require("../config/message");

/**
 * Check Authentication from Headers
 **/

const isAuthenticated = () => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization || req.query.authorization;
      // console.log("token", req.headers);
      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE.unauthorized, data: {}, success: false });
      }
      token = token.split(" ");
      if (!["Bearer", "Token"].includes(token[0])) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE.invalid_token, data: {}, success: false });
      }
      user_obj = await verifyToken(token[1]);
      if (!user_obj) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE.token_expired, data: {}, success: false });
      }
      req.user = user_obj;
      next();
    } catch (err) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Error name: " + err.name + "Error message: " + err.message,
        data: {},
        success: false,
      });
    }
  };
};


module.exports = {
  isAuthenticated,
};

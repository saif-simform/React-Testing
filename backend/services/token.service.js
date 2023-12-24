const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const { User } = require("../models");
const CryptoJS = require("crypto-js");
const { CRYPTO_SECRET_KEY, CRYPTO_SECRET_IV } = require("../config/config");

const key = CryptoJS.enc.Hex.parse(String(CRYPTO_SECRET_KEY));
const iv = CryptoJS.enc.Hex.parse(String(CRYPTO_SECRET_IV));

const encryptUserID = async (userId) => {
  const value = CryptoJS.AES.encrypt(String(userId), key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString();
  return value;
};

const decryptUserID = async (value) => {
  const userId = CryptoJS.AES.decrypt(value, key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString(CryptoJS.enc.Utf8);
  return userId;
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = async (userId, expires, secret = config.JWT.secret) => {
  const payload = {
    sub: await encryptUserID(userId),
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.JWT.secret);
  const userId = await decryptUserID(payload.sub);
  const tokenDoc = await User.findOne({ _id: userId });
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (userId) => {
  const accessTokenExpires = moment().add(
    config.JWT.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = await generateToken(userId, accessTokenExpires);

  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};

require("dotenv").config(); //instatiate environment variables

const CONFIG = {
  // Make this global to use all over the application

  app: process.env.APP || "local",
  port: process.env.PORT || "3002",


  db_dialect: process.env.DB_DIALECT || "mongodb",
  db_host: process.env.DB_HOST || "localhost",
  db_port: process.env.DB_PORT || "27017",
  db_name: process.env.DB_NAME || "time_tracking_db",

  JWT: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },

  CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
  CRYPTO_SECRET_IV: process.env.CRYPTO_SECRET_IV,

};
module.exports = CONFIG;

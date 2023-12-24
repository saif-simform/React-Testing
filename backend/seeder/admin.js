const mongoose = require("mongoose");
require("dotenv").config();
const { User } = require("../models");
const CONFIG = require("../config/config"); // Load the configuartion

async function createMongooseConnection() {
  const db_url = `${CONFIG.db_dialect}://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
  mongoose
    .connect(db_url, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      socketTimeoutMS: 300000,
    })
    .catch((err) => {
      console.log("MongoDB database connection failed", err);
    });
}

async function createAdminEntry() {
  await createMongooseConnection();
  try {
    let data = {
      firstName: "Admin",
      lastName: "admin",
      userName: "Desing-In-DC",
      email: "admin@design.com",
      password: "123123",
      isSuperUser: true,
      isEmailVerified: true,
    };
    await User.create(data).then((user) => {
      console.log(user, "user");
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log("\n Seeding Done!");
    process.exit();
  }
}
createAdminEntry();

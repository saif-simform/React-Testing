const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const controller = require("./controller");
const validation = require("./validation");

router.post("/signup", validate(validation.signup, {}, {}), controller.signup);
router.post("/login", validate(validation.login, {}, {}), controller.login);

module.exports = router;

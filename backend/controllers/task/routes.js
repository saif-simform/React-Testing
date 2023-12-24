const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.route("/:id").get(controller.getById);

router.route("").get(controller.list);


module.exports = router;

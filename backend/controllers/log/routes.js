const express = require("express");
const controller = require("./controller");
const { validate } = require("express-validation");
const validation = require("./validation");
const router = express.Router();

router.route("").post(validate(validation.create, {}, {}), controller.create);
router.get("/filter", controller.getFilterLogsData);
router.get("/list", controller.logList);

router.route("/:id").get(controller.list);

router.put("/status/:id", controller.changeStatus);
router.put("/:id", validate(validation.create, {}, {}), controller.edit);

module.exports = router;

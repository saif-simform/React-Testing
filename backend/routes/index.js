const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authetication");

const authRoutes = require("../controllers/auth/routes");
const projectRoutes = require("../controllers/project/routes");
const taskRoutes = require("../controllers/task/routes");
const logRoutes = require("../controllers/log/routes");

//User api routes

router.use("/auth", authRoutes);
router.use("/project", isAuthenticated(), projectRoutes);
router.use("/task", isAuthenticated(), taskRoutes);
router.use("/logs", isAuthenticated(), logRoutes);

module.exports = router;

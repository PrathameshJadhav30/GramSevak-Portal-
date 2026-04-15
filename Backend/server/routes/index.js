const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const serviceRoutes = require("./service.routes");
const applicationRoutes = require("./application.routes");
const noticeRoutes = require("./notice.routes");
const committeeRoutes = require("./committee.routes");
const complaintRoutes = require("./complaint.routes");
const documentRoutes = require("./document.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/applications", applicationRoutes);
router.use("/notices", noticeRoutes);
router.use("/committee-members", committeeRoutes);
router.use("/complaints", complaintRoutes);
router.use("/documents", documentRoutes);

module.exports = router;

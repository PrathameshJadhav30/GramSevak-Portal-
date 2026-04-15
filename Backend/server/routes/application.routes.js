const express = require("express");

const applicationController = require("../controllers/application.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const validate = require("../middlewares/validate.middleware");
const { applyServiceSchema, updateApplicationStatusSchema } = require("../validations/application.validation");

const router = express.Router();

router.post("/", auth, authorizeRoles("villager"), validate(applyServiceSchema), applicationController.applyForService);
router.get("/me", auth, authorizeRoles("villager"), applicationController.getMyApplications);
router.get("/", auth, authorizeRoles("admin"), applicationController.getAllApplications);
router.patch("/:id/status", auth, authorizeRoles("admin"), validate(updateApplicationStatusSchema), applicationController.updateStatus);
router.delete("/:id", auth, applicationController.deleteApplication);

module.exports = router;

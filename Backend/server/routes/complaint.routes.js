const express = require("express");

const complaintController = require("../controllers/complaint.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const validate = require("../middlewares/validate.middleware");
const { createComplaintSchema, updateComplaintStatusSchema } = require("../validations/complaint.validation");

const router = express.Router();

router.post("/", auth, authorizeRoles("villager"), validate(createComplaintSchema), complaintController.createComplaint);
router.get("/me", auth, authorizeRoles("villager"), complaintController.getMyComplaints);
router.get("/", auth, authorizeRoles("admin"), complaintController.getAllComplaints);
router.patch("/:id/status", auth, authorizeRoles("admin"), validate(updateComplaintStatusSchema), complaintController.updateComplaintStatus);
router.delete("/:id", auth, complaintController.deleteComplaint);

module.exports = router;

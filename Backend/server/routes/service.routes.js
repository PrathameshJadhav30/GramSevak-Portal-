const express = require("express");

const serviceController = require("../controllers/service.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const validate = require("../middlewares/validate.middleware");
const { createServiceSchema, updateServiceSchema } = require("../validations/service.validation");

const router = express.Router();

router.get("/", serviceController.getAllServices);
router.post("/", auth, authorizeRoles("admin"), validate(createServiceSchema), serviceController.createService);
router.put("/:id", auth, authorizeRoles("admin"), validate(updateServiceSchema), serviceController.updateService);
router.delete("/:id", auth, authorizeRoles("admin"), serviceController.deleteService);

module.exports = router;

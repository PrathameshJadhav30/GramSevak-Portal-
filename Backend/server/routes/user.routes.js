const express = require("express");

const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const validate = require("../middlewares/validate.middleware");
const { updateProfileSchema, userIdParamSchema } = require("../validations/user.validation");

const router = express.Router();

router.get("/me", auth, userController.getProfile);
router.put("/me", auth, validate(updateProfileSchema), userController.updateProfile);
router.delete("/:id", auth, authorizeRoles("admin"), validate(userIdParamSchema), userController.deleteUser);

module.exports = router;

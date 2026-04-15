const express = require("express");

const committeeController = require("../controllers/committee.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const ApiError = require("../utils/ApiError");
const { createCommitteeMemberSchema, updateCommitteeMemberSchema } = require("../validations/committee.validation");
const fs = require("fs");
const path = require("path");

const requireImageUpload = (req, _res, next) => {
	if (!req.file) {
		return next(new ApiError(400, "Photo is required"));
	}

	if (!req.file.mimetype.startsWith("image/")) {
		const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
		return next(new ApiError(400, "Only image files are allowed"));
	}

	return next();
};

const allowOnlyImageUpload = (req, _res, next) => {
	if (!req.file) {
		return next();
	}

	if (!req.file.mimetype.startsWith("image/")) {
		const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
		return next(new ApiError(400, "Only image files are allowed"));
	}

	return next();
};

const router = express.Router();

router.get("/", committeeController.getAllMembers);
router.post(
	"/",
	auth,
	authorizeRoles("admin"),
	upload.single("photo"),
	requireImageUpload,
	validate(createCommitteeMemberSchema),
	committeeController.createMember
);
router.put(
	"/:id",
	auth,
	authorizeRoles("admin"),
	upload.single("photo"),
	allowOnlyImageUpload,
	validate(updateCommitteeMemberSchema),
	committeeController.updateMember
);
router.delete("/:id", auth, authorizeRoles("admin"), committeeController.deleteMember);

module.exports = router;

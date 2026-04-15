const express = require("express");

const noticeController = require("../controllers/notice.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const validate = require("../middlewares/validate.middleware");
const { createNoticeSchema, updateNoticeSchema } = require("../validations/notice.validation");

const router = express.Router();

router.get("/", noticeController.getAllNotices);
router.post("/", auth, authorizeRoles("admin"), validate(createNoticeSchema), noticeController.createNotice);
router.put("/:id", auth, authorizeRoles("admin"), validate(updateNoticeSchema), noticeController.updateNotice);
router.delete("/:id", auth, authorizeRoles("admin"), noticeController.deleteNotice);

module.exports = router;

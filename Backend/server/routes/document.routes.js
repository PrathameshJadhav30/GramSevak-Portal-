const express = require("express");

const documentController = require("../controllers/document.controller");
const auth = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const { uploadDocumentSchema } = require("../validations/document.validation");

const router = express.Router();

router.post(
  "/",
  auth,
  authorizeRoles("villager", "admin"),
  upload.single("file"),
  validate(uploadDocumentSchema),
  documentController.uploadDocument
);
router.get("/me", auth, authorizeRoles("villager", "admin"), documentController.getMyDocuments);
router.get("/", auth, authorizeRoles("admin"), documentController.getAllDocuments);
router.delete("/:id", auth, documentController.deleteDocument);

module.exports = router;

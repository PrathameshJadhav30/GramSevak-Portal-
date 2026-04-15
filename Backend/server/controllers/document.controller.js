const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const documentService = require("../services/document.service");

const uploadDocument = asyncHandler(async (req, res) => {
  const data = await documentService.createDocument(req.user.id, req.validated.body, req.file);
  return sendResponse(res, {
    statusCode: 201,
    message: "Document uploaded successfully",
    data,
  });
});

const getMyDocuments = asyncHandler(async (req, res) => {
  const result = await documentService.getMyDocuments(req.user.id, req.query);
  return sendResponse(res, {
    message: "Documents fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const getAllDocuments = asyncHandler(async (req, res) => {
  const result = await documentService.getAllDocuments(req.query);
  return sendResponse(res, {
    message: "All documents fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id, req.user);
  return sendResponse(res, {
    message: "Document deleted successfully",
    data: null,
  });
});

module.exports = {
  uploadDocument,
  getMyDocuments,
  getAllDocuments,
  deleteDocument,
};

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const applicationService = require("../services/application.service");

const applyForService = asyncHandler(async (req, res) => {
  const data = await applicationService.applyForService(req.user.id, req.validated.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "Service application submitted successfully",
    data,
  });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.getMyApplications(req.user.id, req.query);
  return sendResponse(res, {
    message: "Applications fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const getAllApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.getAllApplications(req.query);
  return sendResponse(res, {
    message: "All applications fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const data = await applicationService.updateApplicationStatus(req.validated.params.id, req.validated.body.status);
  return sendResponse(res, {
    message: "Application status updated successfully",
    data,
  });
});

const deleteApplication = asyncHandler(async (req, res) => {
  await applicationService.deleteApplication(req.params.id, req.user);
  return sendResponse(res, {
    message: "Application deleted successfully",
    data: null,
  });
});

module.exports = {
  applyForService,
  getMyApplications,
  getAllApplications,
  updateStatus,
  deleteApplication,
};

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const complaintService = require("../services/complaint.service");

const createComplaint = asyncHandler(async (req, res) => {
  const data = await complaintService.createComplaint(req.user.id, req.validated.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "Complaint submitted successfully",
    data,
  });
});

const getMyComplaints = asyncHandler(async (req, res) => {
  const result = await complaintService.getMyComplaints(req.user.id, req.query);
  return sendResponse(res, {
    message: "Complaints fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const getAllComplaints = asyncHandler(async (req, res) => {
  const result = await complaintService.getAllComplaints(req.query);
  return sendResponse(res, {
    message: "All complaints fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const data = await complaintService.updateComplaintStatus(req.validated.params.id, req.validated.body.status);
  return sendResponse(res, {
    message: "Complaint status updated successfully",
    data,
  });
});

const deleteComplaint = asyncHandler(async (req, res) => {
  await complaintService.deleteComplaint(req.params.id, req.user);
  return sendResponse(res, {
    message: "Complaint deleted successfully",
    data: null,
  });
});

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
};

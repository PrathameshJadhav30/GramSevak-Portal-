const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const committeeService = require("../services/committee.service");

const toPublicPhotoUrl = (req, photoUrl) => {
  if (!photoUrl) {
    return photoUrl;
  }

  if (/^https?:\/\//i.test(photoUrl)) {
    return photoUrl;
  }

  return `${req.protocol}://${req.get("host")}${photoUrl}`;
};

const normalizeMember = (req, member) => ({
  ...member,
  photoUrl: toPublicPhotoUrl(req, member.photoUrl),
});

const createMember = asyncHandler(async (req, res) => {
  const data = await committeeService.createMember(req.validated.body, req.file);
  return sendResponse(res, {
    statusCode: 201,
    message: "Committee member added successfully",
    data: normalizeMember(req, data),
  });
});

const getAllMembers = asyncHandler(async (req, res) => {
  const result = await committeeService.getAllMembers(req.query);
  return sendResponse(res, {
    message: "Committee members fetched successfully",
    data: result.items.map((member) => normalizeMember(req, member)),
    meta: result.meta,
  });
});

const updateMember = asyncHandler(async (req, res) => {
  const data = await committeeService.updateMember(req.validated.params.id, req.validated.body, req.file);
  return sendResponse(res, {
    message: "Committee member updated successfully",
    data: normalizeMember(req, data),
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  await committeeService.deleteMember(req.params.id);
  return sendResponse(res, {
    message: "Committee member deleted successfully",
    data: null,
  });
});

module.exports = {
  createMember,
  getAllMembers,
  updateMember,
  deleteMember,
};

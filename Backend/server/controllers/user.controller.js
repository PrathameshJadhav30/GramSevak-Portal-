const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const userService = require("../services/user.service");

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  return sendResponse(res, {
    message: "Profile fetched successfully",
    data: user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.validated.body);
  return sendResponse(res, {
    message: "Profile updated successfully",
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUserByAdmin(req.validated.params.id);
  return sendResponse(res, {
    message: "User deleted successfully",
    data: null,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  deleteUser,
};

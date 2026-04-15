const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerVillager(req.validated.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "Registration successful",
    data: user,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.validated.body);
  return sendResponse(res, {
    message: "Login successful",
    data: result,
  });
});

module.exports = {
  register,
  login,
};

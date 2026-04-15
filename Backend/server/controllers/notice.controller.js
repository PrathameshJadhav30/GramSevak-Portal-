const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const noticeService = require("../services/notice.service");

const createNotice = asyncHandler(async (req, res) => {
  const data = await noticeService.createNotice(req.validated.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "Notice created successfully",
    data,
  });
});

const getAllNotices = asyncHandler(async (req, res) => {
  const result = await noticeService.getAllNotices(req.query);
  return sendResponse(res, {
    message: "Notices fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const updateNotice = asyncHandler(async (req, res) => {
  const data = await noticeService.updateNotice(req.validated.params.id, req.validated.body);
  return sendResponse(res, {
    message: "Notice updated successfully",
    data,
  });
});

const deleteNotice = asyncHandler(async (req, res) => {
  await noticeService.deleteNotice(req.params.id);
  return sendResponse(res, {
    message: "Notice deleted successfully",
    data: null,
  });
});

module.exports = {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
};

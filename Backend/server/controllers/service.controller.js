const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const serviceService = require("../services/service.service");

const createService = asyncHandler(async (req, res) => {
  const data = await serviceService.createService(req.validated.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "Service created successfully",
    data,
  });
});

const getAllServices = asyncHandler(async (req, res) => {
  const result = await serviceService.getAllServices(req.query);
  return sendResponse(res, {
    message: "Services fetched successfully",
    data: result.items,
    meta: result.meta,
  });
});

const updateService = asyncHandler(async (req, res) => {
  const data = await serviceService.updateService(req.validated.params.id, req.validated.body);
  return sendResponse(res, {
    message: "Service updated successfully",
    data,
  });
});

const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id);
  return sendResponse(res, {
    message: "Service deleted successfully",
    data: null,
  });
});

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
};

const ApiError = require("../utils/ApiError");

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || null;

  if (err.code === "P2002") {
    statusCode = 409;
    message = "A unique field already exists";
    details = err.meta;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }

  if (!(err instanceof ApiError) && statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(details ? { errors: details } : {}),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

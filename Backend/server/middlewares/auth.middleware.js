const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");

const auth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized: token is missing");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true, name: true },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized: user no longer exists");
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;

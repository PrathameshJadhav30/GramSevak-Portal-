const bcrypt = require("bcryptjs");

const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

const updateProfile = async (userId, payload) => {
  const data = { ...payload };
  if (payload.password) {
    data.password = await bcrypt.hash(payload.password, 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return sanitizeUser(updated);
};

const deleteUserByAdmin = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: userId } });
  return null;
};

module.exports = {
  getProfile,
  updateProfile,
  deleteUserByAdmin,
};

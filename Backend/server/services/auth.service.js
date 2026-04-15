const bcrypt = require("bcryptjs");

const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { signToken } = require("../utils/jwt");

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const registerVillager = async (payload) => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });

  if (existing) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      role: "villager",
    },
  });

  return sanitizeUser(user);
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ sub: user.id, role: user.role });

  return {
    token,
    user: sanitizeUser(user),
  };
};

module.exports = {
  registerVillager,
  loginUser,
};

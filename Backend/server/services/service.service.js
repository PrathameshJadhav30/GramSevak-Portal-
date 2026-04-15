const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createService = (payload) => prisma.service.create({ data: payload });

const getAllServices = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.isActive !== undefined ? { isActive: query.isActive === "true" } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.service.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.service.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const updateService = async (id, payload) => {
  const found = await prisma.service.findUnique({ where: { id } });
  if (!found) {
    throw new ApiError(404, "Service not found");
  }
  return prisma.service.update({ where: { id }, data: payload });
};

const deleteService = async (id) => {
  const found = await prisma.service.findUnique({ where: { id } });
  if (!found) {
    throw new ApiError(404, "Service not found");
  }

  await prisma.service.delete({ where: { id } });
  return null;
};

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
};

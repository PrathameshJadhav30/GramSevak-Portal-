const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const applyForService = async (userId, payload) => {
  const service = await prisma.service.findUnique({ where: { id: payload.serviceId } });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return prisma.serviceApplication.create({
    data: {
      userId,
      serviceId: payload.serviceId,
      documents: payload.documents || [],
    },
    include: {
      service: true,
    },
  });
};

const getMyApplications = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    userId,
    ...(query.status ? { status: query.status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.serviceApplication.findMany({
      where,
      include: { service: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceApplication.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const getAllApplications = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
    ...(query.serviceId ? { serviceId: query.serviceId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.serviceApplication.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, mobile: true } },
        service: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceApplication.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const updateApplicationStatus = async (id, status) => {
  const application = await prisma.serviceApplication.findUnique({ where: { id } });
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return prisma.serviceApplication.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      service: true,
    },
  });
};

const deleteApplication = async (id, requester) => {
  const application = await prisma.serviceApplication.findUnique({ where: { id } });
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (requester.role !== "admin" && requester.id !== application.userId) {
    throw new ApiError(403, "Forbidden: you can delete only your own application");
  }

  await prisma.serviceApplication.delete({ where: { id } });
  return null;
};

module.exports = {
  applyForService,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
};

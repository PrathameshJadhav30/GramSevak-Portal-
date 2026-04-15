const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createComplaint = (userId, payload) =>
  prisma.complaint.create({
    data: {
      ...payload,
      userId,
    },
  });

const getMyComplaints = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    userId,
    ...(query.status ? { status: query.status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.complaint.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.complaint.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const getAllComplaints = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, mobile: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.complaint.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const updateComplaintStatus = async (id, status) => {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  return prisma.complaint.update({ where: { id }, data: { status } });
};

const deleteComplaint = async (id, requester) => {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  if (requester.role !== "admin" && requester.id !== complaint.userId) {
    throw new ApiError(403, "Forbidden: you can delete only your own complaint");
  }

  await prisma.complaint.delete({ where: { id } });
  return null;
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
};

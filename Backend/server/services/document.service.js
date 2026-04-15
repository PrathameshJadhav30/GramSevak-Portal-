const fs = require("fs");
const path = require("path");

const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createDocument = async (userId, payload, file) => {
  if (!file) {
    throw new ApiError(400, "File is required");
  }

  const fileUrl = `/uploads/${file.filename}`;

  return prisma.document.create({
    data: {
      userId,
      fileUrl,
      type: payload.type,
    },
  });
};

const getMyDocuments = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    userId,
    ...(query.type ? { type: { contains: query.type, mode: "insensitive" } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.document.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.document.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const getAllDocuments = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.type ? { type: { contains: query.type, mode: "insensitive" } } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, mobile: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.document.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const deleteDocument = async (id, requester) => {
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) {
    throw new ApiError(404, "Document not found");
  }

  if (requester.role !== "admin" && requester.id !== doc.userId) {
    throw new ApiError(403, "Forbidden: you can delete only your own document");
  }

  const absolutePath = path.join(__dirname, "..", doc.fileUrl.replace("/", ""));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await prisma.document.delete({ where: { id } });
  return null;
};

module.exports = {
  createDocument,
  getMyDocuments,
  getAllDocuments,
  deleteDocument,
};

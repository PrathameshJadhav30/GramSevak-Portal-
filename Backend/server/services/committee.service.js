const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const getPhotoUrl = (file) => `/uploads/${file.filename}`;

const createMember = async (payload, photoFile) => {
  if (!photoFile) {
    throw new ApiError(400, "Photo is required");
  }

  return prisma.committeeMember.create({
    data: {
      ...payload,
      photoUrl: getPhotoUrl(photoFile),
    },
  });
};

const getAllMembers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { position: { contains: query.search, mode: "insensitive" } },
          { contact: { contains: query.search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.committeeMember.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.committeeMember.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const updateMember = async (id, payload, photoFile) => {
  const item = await prisma.committeeMember.findUnique({ where: { id } });
  if (!item) {
    throw new ApiError(404, "Committee member not found");
  }

  return prisma.committeeMember.update({
    where: { id },
    data: {
      ...payload,
      ...(photoFile ? { photoUrl: getPhotoUrl(photoFile) } : {}),
    },
  });
};

const deleteMember = async (id) => {
  const item = await prisma.committeeMember.findUnique({ where: { id } });
  if (!item) {
    throw new ApiError(404, "Committee member not found");
  }

  await prisma.committeeMember.delete({ where: { id } });
  return null;
};

module.exports = {
  createMember,
  getAllMembers,
  updateMember,
  deleteMember,
};

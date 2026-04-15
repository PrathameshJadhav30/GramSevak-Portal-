const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createNotice = (payload) => prisma.notice.create({ data: payload });

const getAllNotices = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.language ? { language: query.language } : {}),
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
    prisma.notice.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.notice.count({ where }),
  ]);

  return { items, meta: getPaginationMeta(total, page, limit) };
};

const updateNotice = async (id, payload) => {
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  return prisma.notice.update({ where: { id }, data: payload });
};

const deleteNotice = async (id) => {
  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    throw new ApiError(404, "Notice not found");
  }

  await prisma.notice.delete({ where: { id } });
  return null;
};

module.exports = {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
};

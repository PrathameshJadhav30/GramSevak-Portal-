const { z } = require("zod");

const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(160),
    description: z.string().min(5).max(1000),
    language: z.enum(["en", "mr"]),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateNoticeSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(160).optional(),
      description: z.string().min(5).max(1000).optional(),
      language: z.enum(["en", "mr"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

module.exports = {
  createNoticeSchema,
  updateNoticeSchema,
};

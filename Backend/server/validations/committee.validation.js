const { z } = require("zod");

const createCommitteeMemberSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    position: z.string().min(2).max(120),
    contact: z.string().min(10).max(20),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateCommitteeMemberSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(120).optional(),
      position: z.string().min(2).max(120).optional(),
      contact: z.string().min(10).max(20).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

module.exports = {
  createCommitteeMemberSchema,
  updateCommitteeMemberSchema,
};

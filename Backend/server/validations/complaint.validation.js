const { z } = require("zod");

const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(5).max(1000),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateComplaintStatusSchema = z.object({
  body: z.object({
    status: z.enum(["open", "in_progress", "resolved"]),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

module.exports = {
  createComplaintSchema,
  updateComplaintStatusSchema,
};

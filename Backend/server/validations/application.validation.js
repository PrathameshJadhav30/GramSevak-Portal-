const { z } = require("zod");

const applyServiceSchema = z.object({
  body: z.object({
    serviceId: z.string().uuid(),
    documents: z.array(z.string().min(1)).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected", "pending", "done"]),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

module.exports = {
  applyServiceSchema,
  updateApplicationStatusSchema,
};

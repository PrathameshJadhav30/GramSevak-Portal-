const { z } = require("zod");

const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(120),
    description: z.string().min(5).max(500),
    isActive: z.boolean().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateServiceSchema = z.object({
  body: z
    .object({
      name: z.string().min(3).max(120).optional(),
      description: z.string().min(5).max(500).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};

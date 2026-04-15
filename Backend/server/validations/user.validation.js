const { z } = require("zod");

const updateProfileSchema = z
  .object({
    body: z
      .object({
        name: z.string().min(2).max(100).optional(),
        mobile: z.string().min(10).max(15).optional(),
        address: z.string().min(5).max(255).optional(),
        password: z.string().min(6).max(100).optional(),
      })
      .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
    params: z.object({}),
    query: z.object({}),
  });

const userIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

module.exports = {
  updateProfileSchema,
  userIdParamSchema,
};

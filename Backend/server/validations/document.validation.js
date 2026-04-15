const { z } = require("zod");

const uploadDocumentSchema = z.object({
  body: z.object({
    type: z.string().min(2).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = {
  uploadDocumentSchema,
};

const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    mobile: z.string().min(10).max(15),
    address: z.string().min(5).max(255),
  }),
  params: z.object({}),
  query: z.object({}),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = {
  registerSchema,
  loginSchema,
};

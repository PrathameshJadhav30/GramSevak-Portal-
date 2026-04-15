require("dotenv").config();

const app = require("./app");
const prisma = require("./prisma/client");

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async (signal) => {
  // eslint-disable-next-line no-console
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

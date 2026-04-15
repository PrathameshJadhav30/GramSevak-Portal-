require("dotenv").config();

const bcrypt = require("bcryptjs");

const prisma = require("../prisma/client");

const run = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@gramportal.in";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const name = process.env.ADMIN_NAME || "Portal Admin";
  const mobile = process.env.ADMIN_MOBILE || "9999999999";
  const address = process.env.ADMIN_ADDRESS || "Gram Panchayat Office";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "admin",
      mobile,
      address,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Admin created successfully.");
};

run()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to seed admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

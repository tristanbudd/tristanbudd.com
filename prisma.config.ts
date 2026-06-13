import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "mysql://placeholder:3306/db",
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});

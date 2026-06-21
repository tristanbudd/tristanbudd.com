import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Safe URL parsing function to extract credentials for the driver adapter
const parseDatabaseUrl = (urlStr: string | undefined) => {
  let host = "localhost";
  let port = 3306;
  let user = "dummy";
  let password = "dummy_password";
  let database = "dummy_db";

  if (urlStr) {
    try {
      const parsed = new URL(urlStr);
      host = parsed.hostname || "localhost";
      port = parsed.port ? parseInt(parsed.port, 10) : 3306;
      user = parsed.username ? decodeURIComponent(parsed.username) : "dummy";
      password = parsed.password ? decodeURIComponent(parsed.password) : "dummy_password";
      database = parsed.pathname ? parsed.pathname.replace(/^\//, "") : "dummy_db";
    } catch {
      // If parsing fails, fall back to dummy credentials
    }
  }

  return { host, port, user, password, database };
};

const createPrismaClient = () => {
  const { host, port, user, password, database } = parseDatabaseUrl(process.env.DATABASE_URL);

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 10,
    connectTimeout: process.env.NODE_ENV === "development" ? 1000 : 10000,
    acquireTimeout: process.env.NODE_ENV === "development" ? 1000 : 10000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

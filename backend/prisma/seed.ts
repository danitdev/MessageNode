import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const dani = await prisma.user.create({
    data: {
      name: "Dani",
      email: "dani@example.com",
    },
  });

  const alex = await prisma.user.create({
    data: {
      name: "Alex",
      email: "alex@example.com",
    },
  });

  await prisma.post.createMany({
    data: [
      {
        title: "My First Post",
        content: "Hello from my first post!",
        imageUrl: null,
        creatorId: dani.id,
      },
      {
        title: "Learning Prisma",
        content: "Prisma with MySQL is pretty interesting.",
        imageUrl: null,
        creatorId: dani.id,
      },
      {
        title: "Learning TypeScript",
        content: "TypeScript is starting to make sense.",
        imageUrl: null,
        creatorId: alex.id,
      },
    ],
  });

  console.log("Dummy data created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
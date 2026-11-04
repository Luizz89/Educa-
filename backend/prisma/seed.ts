import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { Role } from "../src/generated/prisma/client";

async function main() {
  const passwordHash = await bcrypt.hash("Senha@123", 10);

  const users = [
    { name: "Ana Aluna", email: "aluna@educamais.test", role: Role.STUDENT },
    { name: "Carlos Professor", email: "professor@educamais.test", role: Role.TEACHER },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
  }

  console.log("Seed concluído: 1 aluno e 1 professor.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] ?? "Administrador";

  if (!email || !password) {
    throw new Error("Uso: npm run create-admin -- <email> <senha> [nome]");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", passwordHash, name },
    });
  } else {
    await prisma.user.create({
      data: { email, passwordHash, name, role: "ADMIN" },
    });
  }

  console.log(`Administrador pronto: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

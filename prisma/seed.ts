import bcrypt from "bcryptjs";
import { PrismaClient, CouponType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123456", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: UserRole.ADMIN },
    create: {
      name: "Administrador",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const categorias = [
    { name: "1º Ano", slug: "1-ano", schoolYear: "1º Ano", subject: "Geral" },
    { name: "2º Ano", slug: "2-ano", schoolYear: "2º Ano", subject: "Geral" },
    { name: "3º Ano", slug: "3-ano", schoolYear: "3º Ano", subject: "Geral" },
    { name: "4º Ano", slug: "4-ano", schoolYear: "4º Ano", subject: "Geral" },
    { name: "5º Ano", slug: "5-ano", schoolYear: "5º Ano", subject: "Geral" },
  ];

  for (const categoria of categorias) {
    await prisma.category.upsert({
      where: { slug: categoria.slug },
      update: categoria,
      create: categoria,
    });
  }

  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: {
      code: "BEMVINDO10",
      type: CouponType.PERCENTAGE,
      value: 10,
      isActive: true,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

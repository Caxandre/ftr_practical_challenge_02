import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "teste@financy.com";
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.transaction.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      name: "Conta teste",
      email,
      passwordHash,
    },
  });

  const categoriesData = [
    { name: "Salário", description: "Renda fixa mensal", color: "BLUE", icon: "briefcase-business" },
    { name: "Alimentação", description: "Mercado e restaurantes", color: "GREEN", icon: "utensils" },
    { name: "Transporte", description: "Combustível e transporte público", color: "ORANGE", icon: "car-front" },
    { name: "Utilidades", description: "Contas de casa", color: "YELLOW", icon: "receipt-text" },
    { name: "Saúde", description: "Consultas e farmácia", color: "RED", icon: "heart-pulse" },
    { name: "Lazer", description: "Cinema, passeios e assinaturas", color: "PINK", icon: "ticket" },
    { name: "Investimentos", description: "Aportes e reservas", color: "PURPLE", icon: "piggy-bank" },
    { name: "Outros", description: "Despesas diversas", color: "GRAY", icon: "shopping-cart" },
  ] as const;

  const categories = await Promise.all(
    categoriesData.map((c) => prisma.category.create({ data: { ...c, userId: user.id } }))
  );

  const byName = (name: string) => categories.find((c) => c.name === name)!.id;

  const today = new Date();
  const daysAgo = (n: number) => new Date(today.getTime() - n * 24 * 60 * 60 * 1000);

  const transactions = [
    { description: "Salário mensal", amount: 550000, type: "INCOME", date: daysAgo(2), categoryId: byName("Salário") },
    { description: "Freelance design", amount: 120000, type: "INCOME", date: daysAgo(10), categoryId: byName("Salário") },
    { description: "Supermercado", amount: 45890, type: "EXPENSE", date: daysAgo(1), categoryId: byName("Alimentação") },
    { description: "Restaurante", amount: 8900, type: "EXPENSE", date: daysAgo(3), categoryId: byName("Alimentação") },
    { description: "Combustível", amount: 22000, type: "EXPENSE", date: daysAgo(4), categoryId: byName("Transporte") },
    { description: "Uber", amount: 3450, type: "EXPENSE", date: daysAgo(5), categoryId: byName("Transporte") },
    { description: "Conta de luz", amount: 18900, type: "EXPENSE", date: daysAgo(6), categoryId: byName("Utilidades") },
    { description: "Internet", amount: 9990, type: "EXPENSE", date: daysAgo(7), categoryId: byName("Utilidades") },
    { description: "Farmácia", amount: 6700, type: "EXPENSE", date: daysAgo(8), categoryId: byName("Saúde") },
    { description: "Plano de saúde", amount: 35000, type: "EXPENSE", date: daysAgo(9), categoryId: byName("Saúde") },
    { description: "Cinema", amount: 5600, type: "EXPENSE", date: daysAgo(11), categoryId: byName("Lazer") },
    { description: "Assinatura streaming", amount: 3990, type: "EXPENSE", date: daysAgo(12), categoryId: byName("Lazer") },
    { description: "Aporte Tesouro Direto", amount: 100000, type: "EXPENSE", date: daysAgo(13), categoryId: byName("Investimentos") },
    { description: "Compra diversa", amount: 4500, type: "EXPENSE", date: daysAgo(14), categoryId: byName("Outros") },
    { description: "Venda item usado", amount: 15000, type: "INCOME", date: daysAgo(15), categoryId: byName("Outros") },
  ] as const;

  for (const t of transactions) {
    await prisma.transaction.create({ data: { ...t, userId: user.id } });
  }

  console.log("Seed concluído:");
  console.log(`  usuário: ${email} / senha: 123456`);
  console.log(`  categorias: ${categories.length}`);
  console.log(`  transações: ${transactions.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

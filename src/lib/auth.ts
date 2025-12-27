import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  // In a real app, this would get the session from NextAuth/Clerk
  const email = "demo@example.com";
  
  let user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: true, fikenInfo: true }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "Demo User",
        role: "VIP",
        wallet: {
          create: {
            accountNumber: "AT-" + Math.floor(10000 + Math.random() * 90000),
            balance: 1000.00, // Initial bonus
          }
        }
      },
      include: { wallet: true, fikenInfo: true }
    });
  }

  return user;
}

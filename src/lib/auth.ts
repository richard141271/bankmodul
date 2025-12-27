import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  // In a real app, this would get the session from NextAuth/Clerk
  const email = "demo@example.com";
  
  // Use upsert to safely handle concurrent requests without crashing
  const user = await prisma.user.upsert({
    where: { email },
    update: {}, // No changes if user exists
    create: {
      email,
      name: "Demo Admin",
      role: "ADMIN",
      wallet: {
        create: {
          accountNumber: "AT-" + Math.floor(10000 + Math.random() * 90000),
          balance: 1000.00, // Initial bonus
        }
      }
    },
    include: { wallet: true, fikenInfo: true }
  });

  return user;
}

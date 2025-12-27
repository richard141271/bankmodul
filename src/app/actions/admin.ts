'use server'

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Secure check to ensure only admins can perform these actions
async function requireAdmin() {
  const user = await getCurrentUser()
  if (user.role !== 'ADMIN') {
    throw new Error("Unauthorized: Admin access required")
  }
  return user
}

export async function getUsers() {
  await requireAdmin()
  
  const users = await prisma.user.findMany({
    include: {
      wallet: true,
      fikenInfo: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return users
}

export async function adjustUserBalance(userId: string, amount: number, reason: string) {
  const admin = await requireAdmin()
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true }
  })

  if (!user || !user.wallet) {
    return { success: false, error: "User or wallet not found" }
  }

  // Determine transaction type based on amount sign
  const type = amount >= 0 ? "DEPOSIT" : "WITHDRAWAL" // Or a specific "ADMIN_ADJUSTMENT" type if we had it
  
  try {
    // 1. Create Transaction Record
    await prisma.transaction.create({
      data: {
        walletId: user.wallet.id,
        amount: Math.abs(amount),
        type: type, // Reusing existing types for simplicity, or we could add 'ADJUSTMENT'
        status: "COMPLETED",
        description: `Admin justering (${admin.name}): ${reason}`,
        reference: "ADMIN_OVERRIDE"
      }
    })

    // 2. Update Wallet Balance
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: { balance: { increment: amount } }
    })

    revalidatePath('/admin')
    revalidatePath('/wallet')
    
    return { success: true }
  } catch (error) {
    console.error("Admin adjustment failed", error)
    return { success: false, error: "Adjustment failed" }
  }
}

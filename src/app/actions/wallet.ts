'use server'

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { fikenService } from "@/lib/fiken"
import { revalidatePath } from "next/cache"

export async function getWallet() {
  const user = await getCurrentUser()
  if (!user.wallet) return null
  
  const transactions = await prisma.transaction.findMany({
    where: { walletId: user.wallet.id },
    orderBy: { createdAt: 'desc' }
  })
  
  return {
    ...user.wallet,
    transactions
  }
}

export async function createDeposit(amount: number) {
  const user = await getCurrentUser()
  if (!user.wallet) throw new Error("No wallet found")
    
  // 1. Create Transaction (Pending)
  const transaction = await prisma.transaction.create({
    data: {
      walletId: user.wallet.id,
      amount: amount,
      type: "DEPOSIT",
      status: "PENDING",
      description: "Innskudd via Stripe/Vipps"
    }
  })
  
  // 2. Fiken Integration
  try {
    // Ensure contact exists
    let fikenContactId = user.fikenInfo?.fikenContactId
    if (!fikenContactId) {
      fikenContactId = await fikenService.createContact(user)
      await prisma.fikenIntegration.upsert({
        where: { userId: user.id },
        update: { fikenContactId },
        create: { userId: user.id, fikenContactId }
      })
    }
    
    // Create Invoice
    const invoiceId = await fikenService.createInvoice(fikenContactId, amount, "Deposit to AI Wallet")
    
    // Register Payment (Simulated instant success for demo)
    await fikenService.registerPayment(invoiceId, amount, transaction.id)
    
    // 3. Update Transaction to Completed and Wallet Balance
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { 
          status: "COMPLETED",
          fikenId: invoiceId
        }
      }),
      prisma.wallet.update({
        where: { id: user.wallet.id },
        data: { balance: { increment: amount } }
      })
    ])
    
    revalidatePath('/')
    return { success: true }
    
  } catch (error) {
    console.error("Deposit failed", error)
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "FAILED" }
    })
    return { success: false, error: "Deposit failed" }
  }
}

export async function requestWithdrawal(amount: number) {
  const user = await getCurrentUser()
  if (!user.wallet) throw new Error("No wallet found")
  
  if (user.wallet.balance < amount) {
    return { success: false, error: "Insufficient funds" }
  }

  // 1. Create Transaction
  const transaction = await prisma.transaction.create({
    data: {
      walletId: user.wallet.id,
      amount: amount, 
      type: "WITHDRAWAL",
      status: "PENDING",
      description: "Utbetaling til bankkonto"
    }
  })

  // 2. Fiken Integration (Journal Entry)
  try {
    let fikenContactId = user.fikenInfo?.fikenContactId || "unknown"
    const journalId = await fikenService.createJournalEntry(transaction, fikenContactId)
    
    // 3. Complete Transaction
    await prisma.$transaction([
       prisma.transaction.update({
        where: { id: transaction.id },
        data: { 
          status: "COMPLETED",
          fikenId: journalId
        }
      }),
      prisma.wallet.update({
        where: { id: user.wallet.id },
        data: { balance: { decrement: amount } }
      })
    ])
    
    revalidatePath('/')
    return { success: true }

  } catch (error) {
    console.error("Withdrawal failed", error)
    await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "FAILED" }
      })
    return { success: false, error: "Withdrawal failed" }
  }
}

export async function registerExpense(amount: number, description: string) {
   const user = await getCurrentUser()
   if (!user.wallet) throw new Error("No wallet found")

   if (user.wallet.balance < amount) {
     return { success: false, error: "Insufficient funds" }
   }
   
   const transaction = await prisma.transaction.create({
    data: {
      walletId: user.wallet.id,
      amount: amount, 
      type: "EXPENSE",
      status: "COMPLETED", // Assuming instant approval for demo
      description: description
    }
  })
  
  // Update Balance
  await prisma.wallet.update({
    where: { id: user.wallet.id },
    data: { balance: { decrement: amount } }
  })
  
  // Fiken
  try {
     let fikenContactId = user.fikenInfo?.fikenContactId || "unknown"
     await fikenService.createPurchase(transaction, fikenContactId)
  } catch (e) {
    console.error("Fiken purchase sync failed", e)
    // Don't fail the transaction just because sync failed, maybe mark for retry
  }
  
  revalidatePath('/')
  return { success: true }
}

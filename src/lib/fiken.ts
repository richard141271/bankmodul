import { User, Transaction } from '@prisma/client'

// Mock Fiken API configuration
// In production, these would be environment variables
const FIKEN_API_URL = 'https://api.fiken.no/api/v2'
const COMPANY_SLUG = process.env.FIKEN_COMPANY_SLUG || 'demo-company'

export const fikenService = {
  /**
   * Creates a new contact in Fiken.
   * Documentation: https://fiken.no/api/doc/contacts
   */
  async createContact(user: User): Promise<string> {
    console.log(`[Fiken] Creating contact for user: ${user.email}`)
    // In a real app, we would POST to /companies/{slug}/contacts
    // const response = await fetch(`${FIKEN_API_URL}/companies/${COMPANY_SLUG}/contacts`, ...)
    
    // Return a mock Fiken Contact ID
    return `fiken_contact_${user.id}_${Math.floor(Math.random() * 1000)}`
  },

  /**
   * Creates an invoice for a deposit.
   * Documentation: https://fiken.no/api/doc/invoices
   */
  async createInvoice(userFikenId: string, amount: number, description: string): Promise<string> {
    console.log(`[Fiken] Creating invoice for contact ${userFikenId}, Amount: ${amount}`)
    // POST to /companies/{slug}/create-invoice-service
    
    return `fiken_invoice_${Date.now()}`
  },

  /**
   * Registers a payment for an invoice.
   * Documentation: https://fiken.no/api/doc/payments
   */
  async registerPayment(invoiceId: string, amount: number, transactionId: string) {
    console.log(`[Fiken] Registering payment for invoice ${invoiceId}, Amount: ${amount}`)
    // POST to /companies/{slug}/sales/{saleId}/payments
    return true
  },

  /**
   * Creates a journal entry for withdrawals or expenses.
   * Documentation: https://fiken.no/api/doc/journal-entries
   */
  async createJournalEntry(transaction: Transaction, userFikenId: string) {
    console.log(`[Fiken] Creating journal entry for transaction ${transaction.id}, Type: ${transaction.type}`)
    // POST to /companies/{slug}/general-journal-entries
    
    return `fiken_journal_${transaction.id}`
  },
  
  /**
   * Registers a purchase (expense) from a receipt
   */
  async createPurchase(transaction: Transaction, userFikenId: string, receiptUrl?: string) {
     console.log(`[Fiken] Creating purchase for transaction ${transaction.id}, Amount: ${transaction.amount}`)
     // POST to /companies/{slug}/purchases
     return `fiken_purchase_${transaction.id}`
  }
}

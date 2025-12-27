'use client'

import { Plus, ArrowRightLeft, Receipt, CreditCard } from 'lucide-react'
import { createDeposit, requestWithdrawal, registerExpense } from '@/app/actions/wallet'

export function ActionButtons() {
  const handleDeposit = async () => {
    const amount = Number(prompt("Beløp å sette inn (NOK):", "500"))
    if (amount) {
      await createDeposit(amount)
    }
  }

  const handleWithdraw = async () => {
    const amount = Number(prompt("Beløp å ta ut (AT):", "100"))
    if (amount) {
      await requestWithdrawal(amount)
    }
  }
  
  const handleExpense = async () => {
    const amount = Number(prompt("Beløp for kjøp (AT):", "50"))
    const desc = prompt("Beskrivelse:", "Lunsj")
    if (amount && desc) {
      await registerExpense(amount, desc)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4 my-6">
      <button onClick={handleDeposit} className="flex flex-col items-center gap-2 p-2 group">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:scale-110 transition-transform shadow-sm">
          <Plus size={24} />
        </div>
        <span className="text-xs font-medium text-center">Sett inn</span>
      </button>
      
      <button onClick={handleWithdraw} className="flex flex-col items-center gap-2 p-2 group">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform shadow-sm">
          <ArrowRightLeft size={24} />
        </div>
        <span className="text-xs font-medium text-center">Veksle/Ut</span>
      </button>
      
      <button onClick={handleExpense} className="flex flex-col items-center gap-2 p-2 group">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-300 group-hover:scale-110 transition-transform shadow-sm">
          <Receipt size={24} />
        </div>
        <span className="text-xs font-medium text-center">Nytt kjøp</span>
      </button>
      
      <button className="flex flex-col items-center gap-2 p-2 group opacity-50 cursor-not-allowed">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-sm">
          <CreditCard size={24} />
        </div>
        <span className="text-xs font-medium text-center">Kort</span>
      </button>
    </div>
  )
}

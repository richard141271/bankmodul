import { Transaction } from '@prisma/client'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Siste bevegelser</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex gap-3 items-center">
              <div className={`w-2 h-2 rounded-full ${
                  tx.status === 'COMPLETED' ? 'bg-green-500' : 
                  tx.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{tx.description || tx.type}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(tx.createdAt), 'd. MMM yyyy', { locale: nb })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${
                tx.type === 'DEPOSIT' || tx.type === 'INCOME' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {(tx.type === 'DEPOSIT' || tx.type === 'INCOME') ? '+' : '-'}
                {tx.amount.toLocaleString('nb-NO', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400">{tx.status}</p>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Ingen transaksjoner enda.
          </div>
        )}
      </div>
    </div>
  )
}

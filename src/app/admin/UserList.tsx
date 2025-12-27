'use client'

import { useState } from 'react'
import { adjustUserBalance } from "@/app/actions/admin"

type UserWithWallet = any // Using any for simplicity in this turn, ideally strict types

export function UserList({ users }: { users: UserWithWallet[] }) {
  const [selectedUser, setSelectedUser] = useState<UserWithWallet | null>(null)
  const [transactionType, setTransactionType] = useState('JUSTERING')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !amount || !reason) return

    setLoading(true)
    
    // Prefix the reason with the type for clarity
    const finalReason = transactionType === 'JUSTERING' ? reason : `[${transactionType}] ${reason}`
    
    let finalAmount = Number(amount)
    
    // Ensure correct sign based on type
    if (transactionType === 'TREKK') {
      finalAmount = -Math.abs(finalAmount)
    } else if (transactionType === 'PROVISJON' || transactionType === 'BONUS') {
      finalAmount = Math.abs(finalAmount)
    }
    // For JUSTERING, we trust the user's input sign
    
    const result = await adjustUserBalance(selectedUser.id, finalAmount, finalReason)
    setLoading(false)

    if (result.success) {
      alert(`${transactionType} registrert!`)
      setSelectedUser(null)
      setAmount('')
      setReason('')
      setTransactionType('JUSTERING')
    } else {
      alert("Feil: " + result.error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-sm">
          <tr>
            <th className="p-4">Bruker</th>
            <th className="p-4">Rolle</th>
            <th className="p-4">Kontonummer</th>
            <th className="p-4 text-right">Saldo</th>
            <th className="p-4 text-right">Handling</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
              <td className="p-4">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs opacity-50">{user.email}</div>
              </td>
              <td className="p-4">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4 font-mono text-sm opacity-70">
                {user.wallet?.accountNumber || '-'}
              </td>
              <td className="p-4 text-right font-bold">
                {user.wallet?.balance.toLocaleString('nb-NO')} {user.wallet?.currency}
              </td>
              <td className="p-4 text-right">
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors font-medium"
                >
                  Behandle / Provisjon
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Administrer {selectedUser.name}</h3>
            
            <form onSubmit={handleAdjust} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-1">Type transaksjon</label>
                <select 
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full p-2 border rounded bg-transparent"
                >
                  <option value="PROVISJON">💰 Registrer Provisjon</option>
                  <option value="BONUS">🌟 Gi Bonus</option>
                  <option value="JUSTERING">🔧 Manuell Justering</option>
                  <option value="TREKK">🔻 Trekk / Gebyr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Beløp</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Eks: 1000"
                    className="w-full p-2 border rounded bg-transparent"
                    required
                  />
                  {transactionType === 'TREKK' && (
                    <span className="absolute right-3 top-2 text-xs text-red-500 font-bold">Vil bli trukket (-)</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Beskrivelse</label>
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={transactionType === 'PROVISJON' ? "Eks: Salg av nettside X" : "Beskrivelse"}
                  className="w-full p-2 border rounded bg-transparent"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">

                <button 
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Avbryt
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Lagrer...' : 'Oppdater saldo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

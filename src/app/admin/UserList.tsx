'use client'

import { useState } from 'react'
import { adjustUserBalance } from "@/app/actions/admin"

type UserWithWallet = any // Using any for simplicity in this turn, ideally strict types

export function UserList({ users }: { users: UserWithWallet[] }) {
  const [selectedUser, setSelectedUser] = useState<UserWithWallet | null>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !amount || !reason) return

    setLoading(true)
    const result = await adjustUserBalance(selectedUser.id, Number(amount), reason)
    setLoading(false)

    if (result.success) {
      alert("Saldo oppdatert!")
      setSelectedUser(null)
      setAmount('')
      setReason('')
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
                  className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                >
                  Juster saldo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Juster saldo for {selectedUser.name}</h3>
            
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Beløp (bruk minus for å trekke fra)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Eks: 1000 eller -500"
                  className="w-full p-2 border rounded bg-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Årsak / Beskrivelse</label>
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Eks: Bonus, Refusjon, Manuell korrigering"
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

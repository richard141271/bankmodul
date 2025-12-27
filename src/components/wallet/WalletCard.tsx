import { Wallet, User } from '@prisma/client'

interface WalletCardProps {
  wallet: Wallet
  user: User
}

export function WalletCard({ wallet, user }: WalletCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-lg font-medium opacity-90">AI Wallet Bank™</h2>
          <p className="text-sm opacity-70">Privatkonto</p>
        </div>
        <div className="text-right">
           <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
             {user.role}
           </span>
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-4xl font-bold mb-1">
          {wallet.balance.toLocaleString('nb-NO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl font-normal">{wallet.currency}</span>
        </p>
        <p className="text-sm opacity-70">Saldo</p>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
           <p className="text-sm font-mono opacity-80">{wallet.accountNumber}</p>
           <p className="text-xs opacity-60 uppercase tracking-wide">{user.name}</p>
        </div>
        <div className="w-10 h-6 bg-yellow-400/20 rounded-md flex items-center justify-center border border-yellow-400/40">
           <div className="w-6 h-4 border border-yellow-400/60 rounded-sm"></div>
        </div>
      </div>
    </div>
  )
}

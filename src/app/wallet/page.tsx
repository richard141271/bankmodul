import { getWallet } from "@/app/actions/wallet"
import { getCurrentUser } from "@/lib/auth"
import { WalletCard } from "@/components/wallet/WalletCard"
import { ActionButtons } from "@/components/wallet/ActionButtons"
import { TransactionList } from "@/components/wallet/TransactionList"

export const dynamic = 'force-dynamic'

export default async function WalletPage() {
  const user = await getCurrentUser()
  const walletData = await getWallet()

  if (!user || !walletData) {
    return <div className="p-8 text-center">Laster bank...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 pb-20">
      <header className="bg-white dark:bg-gray-900 p-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold text-center">Min Økonomi</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <WalletCard wallet={walletData} user={user} />
        
        <ActionButtons />
        
        <TransactionList transactions={walletData.transactions} />
      </main>
    </div>
  )
}

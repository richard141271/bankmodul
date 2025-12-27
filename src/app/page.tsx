import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-black text-center">
      <h1 className="text-4xl font-bold mb-4">LEK-Biens Vokter</h1>
      <p className="mb-8 text-xl opacity-70">Velkommen til medlemsportalen</p>
      
      <div className="flex gap-4">
        <Link 
          href="/wallet" 
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Åpne AI Wallet Bank™
        </Link>
        
        <Link 
          href="/admin" 
          className="px-6 py-3 bg-gray-800 text-white rounded-full font-bold shadow-lg hover:bg-gray-700 transition-colors"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  )
}

import { getUsers } from "@/app/actions/admin"
import { UserList } from "./UserList" // We'll create this client component next
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const currentUser = await getCurrentUser()
  
  if (currentUser.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await getUsers()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Kontrollpanel</h1>
            <p className="opacity-70">Administrer brukere og saldoer</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
            Admin Mode
          </div>
        </header>

        <main>
          <UserList users={users} />
        </main>
      </div>
    </div>
  )
}

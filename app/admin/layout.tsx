import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Allow access to login page without auth
  // The middleware handles the redirect for other admin routes

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

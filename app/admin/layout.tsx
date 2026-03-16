import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminMobileBottomNav } from '@/components/admin/mobile-bottom-nav'

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
          <main className="flex-1 overflow-auto p-4 pb-24 pt-24 sm:p-6 sm:pb-24 sm:pt-24 lg:p-8 lg:pb-8 lg:pt-8">
            {children}
          </main>
          <AdminMobileBottomNav />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

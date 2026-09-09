import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/lib/auth'

export default function AppPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function handleSignOut() {
    await queryClient.cancelQueries()
    queryClient.clear()
    await supabase.auth.signOut()
    navigate('/signin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <span className="text-sm font-semibold tracking-tight">Flight Price Notifier</span>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Sign out / 登出
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-20">
        <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />
        <div className="relative">
          <h1 className="text-2xl font-semibold sm:text-3xl">Hi {user?.email}</h1>
          <div className="mt-8 rounded-2xl border border-border bg-card p-8">
            <p className="text-base">
              你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Your dashboard is coming soon. Route-subscription will be added in the next milestone.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

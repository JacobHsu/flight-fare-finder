import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/lib/auth'

const API = 'https://paqoi7qz7i.execute-api.us-east-1.amazonaws.com'

const PLANS = [
  {
    plan_name: 'tokyo',
    label: '台北 ✈ 東京',
    en: 'Taipei → Tokyo',
    route: 'TPE-TYO',
    emoji: '🗼',
    placeholder: '例：10000',
  },
  {
    plan_name: 'seoul',
    label: '台北 ✈ 首爾',
    en: 'Taipei → Seoul',
    route: 'TPE-SEL',
    emoji: '🏯',
    placeholder: '例：7000',
  },
]

type Subscription = {
  route: string
  plan_name: string
  target_price: number
  currency: string
  created_at: string
}

export default function AppPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [message, setMessage] = useState<Record<string, string>>({})
  const [fetchingList, setFetchingList] = useState(true)

  // 載入已訂閱清單
  useEffect(() => {
    if (!user?.email) return
    fetch(`${API}/subscriptions?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => {
        setSubscriptions(data.subscriptions || [])
        // 預填現有目標價
        const prefill: Record<string, string> = {}
        for (const s of data.subscriptions || []) {
          prefill[s.plan_name] = String(Math.round(s.target_price))
        }
        setPrices(prev => ({ ...prev, ...prefill }))
      })
      .catch(() => {})
      .finally(() => setFetchingList(false))
  }, [user?.email])

  function getSubscription(plan_name: string) {
    return subscriptions.find(s => s.plan_name === plan_name)
  }

  async function handleSubscribe(plan_name: string) {
    const target = parseInt(prices[plan_name] || '0', 10)
    if (!target || target < 1000) {
      setMessage(m => ({ ...m, [plan_name]: '請輸入合理的目標價（例：10000）' }))
      return
    }
    setLoading(l => ({ ...l, [plan_name]: true }))
    setMessage(m => ({ ...m, [plan_name]: '' }))
    try {
      const res = await fetch(`${API}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, plan_name, target_price: target }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // 更新本地訂閱清單
      const existing = getSubscription(plan_name)
      if (existing) {
        setSubscriptions(subs =>
          subs.map(s => s.plan_name === plan_name ? { ...s, target_price: target } : s)
        )
        setMessage(m => ({ ...m, [plan_name]: '✅ 目標價已更新！' }))
      } else {
        setSubscriptions(subs => [
          ...subs,
          { route: PLANS.find(p => p.plan_name === plan_name)!.route, plan_name, target_price: target, currency: 'TWD', created_at: new Date().toISOString() },
        ])
        setMessage(m => ({ ...m, [plan_name]: '✅ 訂閱成功！降價就通知你。' }))
      }
    } catch {
      setMessage(m => ({ ...m, [plan_name]: '❌ 發生錯誤，請再試一次。' }))
    } finally {
      setLoading(l => ({ ...l, [plan_name]: false }))
    }
  }

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
          <span className="text-sm font-semibold tracking-tight">✈ Flight Price Notifier</span>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Sign out / 登出
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-12">
        <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />
        <div className="relative">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Hi, {user?.email?.split('@')[0]} 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            設定目標票價，低於目標就發 email 通知你。
          </p>

          {fetchingList ? (
            <div className="mt-10 text-sm text-muted-foreground">載入中…</div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {PLANS.map(plan => {
                const sub = getSubscription(plan.plan_name)
                const isSubscribed = Boolean(sub)
                return (
                  <article
                    key={plan.plan_name}
                    className="rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:border-primary/40 hover:shadow-glow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-2xl">{plan.emoji}</div>
                        <h2 className="mt-2 text-base font-bold text-foreground">{plan.label}</h2>
                        <p className="text-xs text-muted-foreground">{plan.en}</p>
                      </div>
                      {isSubscribed && (
                        <span className="mt-1 shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          已訂閱
                        </span>
                      )}
                    </div>

                    {/* 現有訂閱資訊 */}
                    {sub && (
                      <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 text-sm">
                        <span className="text-muted-foreground">目前目標價：</span>
                        <span className="ml-1 font-semibold text-primary">
                          NT$ {Math.round(sub.target_price).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* 輸入 + 按鈕 */}
                    <div className="mt-5 flex gap-2">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          NT$
                        </span>
                        <input
                          type="number"
                          min="1000"
                          step="500"
                          value={prices[plan.plan_name] || ''}
                          onChange={e =>
                            setPrices(p => ({ ...p, [plan.plan_name]: e.target.value }))
                          }
                          placeholder={plan.placeholder}
                          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <button
                        onClick={() => handleSubscribe(plan.plan_name)}
                        disabled={loading[plan.plan_name]}
                        className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                      >
                        {loading[plan.plan_name]
                          ? '…'
                          : isSubscribed
                          ? '更新目標價'
                          : '開始追蹤'}
                      </button>
                    </div>

                    {/* 回饋訊息 */}
                    {message[plan.plan_name] && (
                      <p className="mt-3 text-sm text-primary">{message[plan.plan_name]}</p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { useAuth } from '@/lib/auth'

const features = [
  {
    title: '盯緊熱門航線',
    en: 'Always-on route watching',
    body: '持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。',
  },
  {
    title: '達標自動通知',
    en: 'Target-price email alerts',
    body: '低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。',
  },
  {
    title: '隨時取消',
    en: 'Cancel anytime',
    body: '月訂閱制，不想用隨時停，沒有綁約。',
  },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Flight Price Notifier
          </span>
          <Link
            to={user ? '/app' : '/signin'}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {user ? '前往儀表板' : 'Sign in / 登入'}
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
            <Reveal>
              <p className="mb-5 inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                台北出發 · 東京 / 首爾
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                Flight Price Notifier
              </h1>
              <p className="mt-6 text-lg text-foreground sm:text-2xl">
                設定航線與目標價，機票降價就通知你
              </p>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Set a route and a target price — we email you when the fare drops.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  to="/signup"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  免費註冊 / Create account
                </Link>
                <Link
                  to="/signin"
                  className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Sign in / 登入
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.en} delay={i * 120}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
                  <h2 className="text-lg font-semibold">{f.title}</h2>
                  <p className="mt-1 text-xs uppercase tracking-wide text-accent">{f.en}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-muted-foreground">
          © 2026 Flight Price Notifier
        </div>
      </footer>
    </div>
  )
}

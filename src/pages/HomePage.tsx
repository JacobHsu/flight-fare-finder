import { Link } from 'react-router-dom'
import { Reveal } from '@/components/Reveal'
import { useAuth } from '@/lib/auth'

const features = [
  {
    title: '盯緊熱門航線',
    en: 'Always-on route watching',
    body: '持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。',
    icon: '✈️',
  },
  {
    title: '達標自動通知',
    en: 'Target-price email alerts',
    body: '低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。',
    icon: '🔔',
  },
  {
    title: '隨時取消',
    en: 'Cancel anytime',
    body: '月訂閱制，不想用隨時停，沒有綁約。',
    icon: '🌿',
  },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav — bright, open, like the Mediterranean shopfronts */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="text-sm font-bold tracking-tight text-primary sm:text-base">
            ✈ Flight Price Notifier
          </span>
          <Link
            to={user ? '/app' : '/signin'}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0"
          >
            {user ? '前往儀表板' : 'Sign in / 登入'}
          </Link>
        </div>
      </header>

      <main>
        {/* Hero — luminous sky wash, Ghibli horizon */}
        <section className="relative overflow-hidden">
          {/* Sky gradient from top */}
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />

          {/* Decorative cloud shapes */}
          <div className="pointer-events-none absolute top-8 left-[10%] h-16 w-28 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
          <div className="pointer-events-none absolute top-4 right-[15%] h-12 w-20 rounded-full bg-primary/8 blur-xl" aria-hidden="true" />
          <div className="pointer-events-none absolute top-20 right-[30%] h-8 w-16 rounded-full bg-accent/10 blur-lg" aria-hidden="true" />

          <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:py-36">
            <Reveal>
              {/* Eyebrow — like a little painted signboard */}
              <p className="mb-6 inline-block rounded-full border border-primary/30 bg-secondary px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
                台北出發 · 東京 / 首爾
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Flight Price{' '}
                <span className="text-primary">Notifier</span>
              </h1>

              <p className="mt-6 text-lg text-foreground/75 sm:text-xl">
                設定航線與目標價，機票降價就通知你
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Set a route and a target price — we email you when the fare drops.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link
                  to="/signup"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
                >
                  免費註冊 / Create account
                </Link>
                <Link
                  to="/signin"
                  className="rounded-full border border-border bg-card px-7 py-3 text-sm font-medium text-foreground/70 transition-all hover:bg-secondary hover:text-primary hover:border-primary/40"
                >
                  Sign in / 登入
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Horizon accent line — like where sea meets sky */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </section>

        {/* Feature cards — Mediterranean storefronts, bright & inviting */}
        <section className="mx-auto max-w-6xl px-5 pb-28 pt-14">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.en} delay={i * 120}>
                <article className="watercolor-hover group h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-glow hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-xl">
                    {f.icon}
                  </div>
                  <h2 className="text-base font-bold text-foreground">{f.title}</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-primary">{f.en}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-8 text-center text-sm text-muted-foreground">
          © 2026 Flight Price Notifier
        </div>
      </footer>
    </div>
  )
}

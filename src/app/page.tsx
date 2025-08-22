import Image from "next/image";
import Link from "next/link";
import StickyCTA from "@/components/StickyCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-background)/0.6] bg-[color:var(--color-background)/0.8] border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Ettle logo" width={36} height={36} />
            <span className="text-lg font-semibold">Ettle</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex text-sm text-[var(--color-muted)]">
            <a href="#why">Why Ettle</a>
            <a href="#how">How it works</a>
            <a href="#social">Social proof</a>
          </nav>
          <Link href="/signup" className="btn-primary hidden md:inline-flex" aria-label="Get the app">
            Get the app
          </Link>
        </div>
      </header>

      {/* Hero — above the fold */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Personalised training. Real results.
              <br />
              <span className="text-[var(--color-primary)]">Built for Edinburgh.</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">
              Smart workouts that adapt to your time, experience and goals—without the cost of a personal trainer.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="btn-primary" aria-label="Join the beta">
                Join the free Edinburgh beta
              </Link>
              <span className="text-sm text-[var(--color-muted)]">
                Students of UoE, Napier &amp; Heriot-Watt welcome.
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="card">
              <Image
                src="/mockup-phone.png"
                alt="Ettle app mockup"
                width={900}
                height={900}
                className="h-auto -z-30 w-full rounded-[1rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Ettle (benefits) */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">Why people in Edinburgh choose Ettle</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Fits your week",
              desc: "Tell us your days and session length; we build a plan you can actually keep.",
            },
            {
              title: "Progresses automatically",
              desc: "Volume & load scale up based on your completed workouts—no spreadsheets needed.",
            },
            {
              title: "Beginner-safe guidance",
              desc: "Clear instructions and videos help you lift confidently from day one.",
            },
            {
              title: "Edinburgh-friendly pricing",
              desc: "Designed for student budgets—get personal-trainer-level structure for less.",
            },
            {
              title: "Motivation that sticks",
              desc: "Light gamification keeps consistency rewarding—earn XP for showing up.",
            },
            {
              title: "Swap exercises easily",
              desc: "Busy gym? Instantly switch to equipment that targets the same muscles.",
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-[var(--color-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Quick onboarding",
              desc: "Level, goals, available days, and time per session.",
            },
            {
              step: "02",
              title: "Session 0",
              desc: "Find your 10RM on key lifts to personalise intensity.",
            },
            {
              step: "03",
              title: "Adaptive plans",
              desc: "Weekly sessions update as you progress—safe and sustainable.",
            },
          ].map((s) => (
            <div key={s.step} className="card">
              <div className="text-[var(--color-primary)] text-sm font-semibold">{s.step}</div>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-[var(--color-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section id="social" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">What locals say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <figure className="card">
            <blockquote className="text-lg">
              “I finally stuck to 4 days a week while studying at UoE. Clear plans, no guesswork.”
            </blockquote>
            <figcaption className="mt-3 text-sm text-[var(--color-muted)]">
              — Luiz, Student in Edinburgh
            </figcaption>
          </figure>
          <figure className="card">
            <blockquote className="text-lg">
              “Beginner-friendly guidance made the weights area feel safe.”
            </blockquote>
            <figcaption className="mt-3 text-sm text-[var(--color-muted)]">
              — Amanda, Psychology student
            </figcaption>
          </figure>
        </div>
        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary" aria-label="Get started now">
            Get started now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Ettle logo small" width={24} height={24} />
            <span className="text-sm text-[var(--color-muted)]">
              © {new Date().getFullYear()} Ettle
            </span>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            Built for Edinburgh • Privacy-friendly • Made with care
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <StickyCTA />
    </main>
  );
}

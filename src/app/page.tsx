"use client";

// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import StickyCTA from "@/components/StickyCTA";
import PhoneMockup from "@/components/PhoneMockup";

/** Componente isolado do mockup com animação GSAP */

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-background)/0.6] bg-[color:var(--color-background)/0.8] border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Ettle logo" width={50} height={50} />
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
              Science Based
              <br />
              <span className="text-[var(--color-primary)]">Personalised Workout.</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--color-muted)]">
              Smart workouts that adapt to your schedule, experience and goals WITHOUT the cost of a personal trainer.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="btn-primary" aria-label="Join the beta">
                Join the free Edinburgh beta
              </Link>
              <Link href="/" className="text-sm text-[var(--color-muted)]">
                Find out more
              </Link>
            </div>
          </div>

          {/* Visual com GSAP */}
          <PhoneMockup />
        </div>
      </section>

      {/* Why Ettle (benefits) */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">Why choose Ettle...</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Fits your schedule",
              desc: "Tell us your days and availability - we build a plan you can actually keep.",
            },
            {
              title: "Planned Progress",
              desc: "Planned progression of training variables to keep you improving.",
            },
            {
              title: "Beginner-safe guidance",
              desc: "Clear instructions and videos help you lift confidently from day one.",
            },
            {
              title: "Have a gym bro",
              desc: "Match your workout with a friend and train together properly.",
            },
            {
              title: "Swap exercises easily",
              desc: "Busy gym? We instantly rebuild your session to avoid waiting for equipment.",
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
              title: "Quick Onboarding",
              desc: "Level, goals, available days, and time per session.",
            },
            {
              step: "02",
              title: "Fitness Level",
              desc: "Find your ideal intensity to personalise your training loads.",
            },
            {
              step: "03",
              title: "Ideal Plan and Progression",
              desc: "Weekly sessions update as you progress&mdash;safe and sustainable.",
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

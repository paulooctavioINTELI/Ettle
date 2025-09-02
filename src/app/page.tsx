// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import StickyCTA from "@/components/StickyCTA";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PhoneMockup from "@/components/landing/PhoneMockup";
import WhyEttle from "@/components/landing/WhyEttle";
import { FaEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)]">
      {/* Skip link para acessibilidade */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 rounded-md bg-white/10 px-3 py-2 text-sm"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-background)/0.6] bg-[color:var(--color-background)/0.8] border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Ettle logo"
              width={50}
              height={50}
              sizes="(max-width:768px) 40px, 50px"
              priority
            />
            <span className="text-lg font-semibold">Ettle</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex text-sm text-[var(--color-muted)]">
            <a href="#why">Why Ettle</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a> {/* ✅ sem social proof por enquanto */}
          </nav>
          <Link
            href="/signup"
            className="btn-primary hidden md:inline-flex"
            aria-label="Join the beta"
            data-analytics="nav_cta_join_beta"
          >
            Join the beta
          </Link>
        </div>
      </header>

      {/* Hero — above the fold */}
      <section id="hero" className="relative overflow-hidden">
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
              <Link
                href="/signup"
                className="btn-primary"
                aria-label="Join the beta"
                data-analytics="hero_cta_join_beta"
              >
                Join the free Edinburgh beta
              </Link>
              <a
                href="#why"
                className="text-sm text-[var(--color-muted)]"
                data-analytics="hero_secondary_learn_more"
              >
                Why Ettle
              </a>
            </div>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <WhyEttle />

      {/* How it works (mantido com sua animação) */}
      <HowItWorks />
      
      <FeaturesSection />

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-2xl font-semibold md:text-3xl">FAQ</h2>
        <div className="mt-8 space-y-6">
          <div className="card">
            <h3 className="font-semibold">Is the beta only in Edinburgh?</h3>
            <p className="text-[var(--color-muted)]">Yes, for now. More cities soon.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold">Do I need a gym membership?</h3>
            <p className="text-[var(--color-muted)]">Works at the gym or at home — the plan adapts to your setup.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold">How do I join?</h3>
            <p className="text-[var(--color-muted)]">
              Tap <Link href="/signup" className="underline">Join the beta</Link> and complete the form (email & phone).
            </p>
          </div>
        </div>
        <div className="mt-10">
          <Link
            href="/signup"
            className="btn-primary"
            aria-label="Join the beta"
            data-analytics="faq_cta_join_beta"
          >
            Join the beta
          </Link>
        </div>
      </section>

      {/* Footer */}
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
        {/* Logo + ano */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Ettle logo small"
            width={24}
            height={24}
            sizes="24px"
          />
          <span className="text-sm text-[var(--color-muted)]">
            © {new Date().getFullYear()} Ettle
          </span>
        </div>

        {/* Links */}
        <div className="text-sm text-[var(--color-muted)] flex gap-4 items-center">
          <span>Built for Edinburgh</span>
          <span>•</span>
          <span>Privacy-friendly</span>
          <span>•</span>
          <Link href="/privacy" className="underline">Privacy</Link>
          <span>•</span>
          {/* Contatos com ícones */}
          <div className="flex gap-4 items-center">
            <a
              href="mailto:contact@ettle.app"
              aria-label="Email"
              className="hover:text-white transition-colors"
            >
              <FaEnvelope size={18} />
            </a>
            <a
              href="https://instagram.com/ettle.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>

      {/* Mobile sticky CTA */}
      <StickyCTA />
    </main>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FeatureProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  last?: boolean;
};

export default function Feature({
  id,
  title,
  subtitle,
  description,
  last,
}: FeatureProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Respeita usuários que pedem menos movimento
    if (prefersReduced) {
      gsap.set(el, { x: 0, y: 0, opacity: 1, clearProps: "transform" });
      return;
    }

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Mobile: fade-up uma vez (sem saída)
      mm.add("(max-width: 767px)", () => {
        gsap.set(el, { y: 28, opacity: 0, willChange: "transform,opacity" });

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: "power3.out",
              clearProps: "will-change",
            });
          },
        });

        return () => st.kill();
      });

      // Desktop: mantém a animação original com scrub e saída
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            // markers: true,
          },
        });

        gsap.set(el, { x: -80, opacity: 0, willChange: "transform,opacity" });

        tl.to(el, { x: 0, opacity: 1, ease: "power3.out", duration: 0.45 })
          .to(el, { x: 0, opacity: 1, ease: "none", duration: 0.15 })
          .to(el, { x: -80, opacity: 0, ease: "power3.in", duration: 0.4 });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative ${last ? "" : "mb-24"}`}
    >
      <div className="w-full py-16 md:py-24 pr-0 md:pr-6">
        <div className="max-w-[44rem]">
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">
            {title || "Gamified Fitness"}
            <br />
            <span className="text-[var(--color-primary)]">
              {subtitle || "not found"}
            </span>
          </h2>

          <p className="mt-4 text-base md:text-lg text-[var(--color-muted)]">
            {description ||
              "Stay motivated with our gamified fitness experience. Earn points, unlock achievements, and climb the leaderboards as you smash your workout goals."}
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
      </div>
    </section>
  );
}

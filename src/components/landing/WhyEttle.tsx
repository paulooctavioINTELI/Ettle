"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhyEttle() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const cardsWrap = cardsWrapRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-why-title]");
      const intro = el.querySelector<HTMLElement>("[data-why-intro]");
      const cards = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-why-card]"));
      const compareWrap = el.querySelector<HTMLElement>("[data-why-compare]");
      const cta = el.querySelector<HTMLElement>("[data-why-cta]");

      if (prefersReduced) {
        gsap.set([title, intro, compareWrap, cta, ...cards], { y: 0, opacity: 1, clearProps: "transform" });
        return;
      }

      // MOBILE: animações simples + cards horizontais
      mm.add("(max-width: 767px)", () => {
        // título e intro
        gsap.fromTo(
          [title, intro],
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );

        // cards no scroller horizontal
        if (cardsWrap && cards.length) {
          gsap.set(cards, { x: 24, opacity: 0.001, willChange: "transform,opacity" });
          cards.forEach((card) => {
            ScrollTrigger.create({
              trigger: card,
              scroller: cardsWrap,
              start: "left 90%",
              end: "left 60%",
              once: true,
              onEnter: () =>
                gsap.to(card, {
                  x: 0,
                  opacity: 1,
                  duration: 0.45,
                  ease: "power3.out",
                  clearProps: "will-change",
                }),
              onEnterBack: () =>
                gsap.to(card, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }),
            });
          });
        }

        // comparativo
        if (compareWrap) {
          gsap.fromTo(
            compareWrap,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
              scrollTrigger: { trigger: compareWrap, start: "top 85%", once: true },
            }
          );
        }

        // CTA
        if (cta) {
          gsap.fromTo(
            cta,
            { y: 14, opacity: 0, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.6)",
              scrollTrigger: { trigger: cta, start: "top 90%", once: true },
            }
          );
        }
      });

      // DESKTOP: mantém sua versão com scrub
      mm.add("(min-width: 768px)", () => {
        gsap.set([title, intro], { y: 24, opacity: 0, willChange: "transform,opacity" });
        gsap.to([title, intro], {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 55%", scrub: true, invalidateOnRefresh: true },
        });

        gsap.set(cards, { y: 32, opacity: 0, rotateX: -4, transformPerspective: 800, willChange: "transform,opacity" });
        gsap.to(cards, {
          y: 0, opacity: 1, rotateX: 0, ease: "power3.out", duration: 0.7, stagger: 0.12,
          scrollTrigger: { trigger: el.querySelector("[data-why-cards]") || el, start: "top 75%", end: "top 45%", scrub: true, invalidateOnRefresh: true },
        });

        if (compareWrap) {
          gsap.set(compareWrap, { y: 40, opacity: 0, rotateX: -3, transformPerspective: 800, willChange: "transform,opacity" });
          gsap.to(compareWrap, {
            y: 0, opacity: 1, rotateX: 0, ease: "power3.out", duration: 0.7,
            scrollTrigger: { trigger: compareWrap, start: "top 80%", end: "top 55%", scrub: true, invalidateOnRefresh: true },
          });
        }

        if (cta) {
          gsap.fromTo(
            cta,
            { y: 16, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", scrollTrigger: { trigger: cta, start: "top 85%", once: true } }
          );
        }
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="why" className="mx-auto max-w-6xl px-4 py-20">
      <h2 data-why-title className="text-2xl font-semibold md:text-3xl">Why Ettle</h2>

      <p data-why-intro className="mt-3 text-[var(--color-muted)] max-w-2xl">
        Evidence-based training that adapts to your level and routine — results without paying personal-trainer prices.
      </p>

      {/* MOBILE: cards horizontais com snap  |  DESKTOP: grid 3 colunas */}
      <div
        ref={cardsWrapRef}
        data-why-cards
        className="
          mt-10
          flex md:grid
          gap-4 md:gap-6
          overflow-x-auto md:overflow-visible
          snap-x snap-mandatory md:snap-none
          -mx-4 px-4 md:mx-0 md:px-0
          pb-2 md:pb-0
          md:grid-cols-3
        "
      >
        {[
          { t: "Science-based", d: "Planned progression, safe intensity, sustainable results." },
          { t: "Truly personalised", d: "Adjusts to level, schedule, goals and available days." },
          { t: "Accessible", d: "Beta is free in Edinburgh; fair pricing after launch." },
        ].map((b) => (
          <div key={b.t} data-why-card className="card shrink-0 w-[85%] snap-center md:w-auto md:shrink md:snap-none">
            <h3 className="font-semibold">{b.t}</h3>
            <p className="text-[var(--color-muted)] mt-1">{b.d}</p>
          </div>
        ))}
      </div>

      {/* Comparativo */}
      <div data-why-compare className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold">Ettle</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--color-muted)]">
            <li>• Planos dinâmicos que evoluem com seus dados</li>
            <li>• Explicações claras para cada exercício</li>
            <li>• Gamificação (XP, leaderboards, recompensas)</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold">Personal trainer tradicional</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--color-muted)]">
            <li>• Alto custo por sessão</li>
            <li>• Difícil manter consistência na agenda</li>
            <li>• Dependência do profissional</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10" data-why-cta>
        <Link href="/signup" className="btn-primary" aria-label="Join the beta" data-analytics="why_cta_join_beta">
          Join the beta — free in Edinburgh
        </Link>
      </div>
    </section>
  );
}

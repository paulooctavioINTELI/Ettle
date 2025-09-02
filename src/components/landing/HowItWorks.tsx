"use client";

// HowItWorks.tsx

import { useLayoutEffect, useRef } from "react";
import { FaArrowDownLong, FaArrowRightLong } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".how-item");

      if (prefersReduced) {
        gsap.set(items, { y: 0, opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.set(items, {
        y: -24,
        opacity: 0,
        willChange: "transform, opacity",
        force3D: true,
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
      });

      ScrollTrigger.create({
        trigger: title,
        start: "center center",
        once: true,
        onEnter: () => tl.play(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how" ref={sectionRef} className="mx-auto max-w-6xl px-4 py-16">
      <h2 ref={titleRef} className="text-2xl font-semibold md:text-3xl">
        How it works
      </h2>

      {/* MOBILE: coluna vertical | DESKTOP: mantém espaçamentos */}
      <div
        id="how-list"
        className="mx-auto flex flex-col gap-6 md:gap-10 px-4 py-10 md:py-10"
      >
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
            desc: "Weekly sessions update as you progress - safe and sustainable.",
            last: true,
          },
        ].map((s) => (
          <div
            key={s.step}
            className="how-item card flex flex-row justify-between items-center gap-4"
          >
            <div>
              <div className="text-[var(--color-primary)] text-sm font-semibold">
                {s.step}
              </div>
              <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-[var(--color-muted)]">{s.desc}</p>
            </div>

            {/* Ícone: seta para BAIXO no mobile, seta para DIREITA no desktop; último = check */}
            {!s.last ? (
              <>
                <FaArrowDownLong className="md:hidden" color="#FF6831" size={32} />
                <FaArrowRightLong className="hidden md:block" color="#FF6831" size={40} />
              </>
            ) : (
              <IoMdCheckmark color="#FF6831" size={40} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

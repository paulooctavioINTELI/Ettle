"use client";

// PhoneMockup.tsx

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function PhoneMockup() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapRef.current) return;

    const ctx = gsap.context(() => {
      // Estado inicial no wrapper (não na <Image>)
      gsap.set(wrapRef.current, {
        y: 300,
        opacity: 0,
        scale: 0.9,
      });

      // Animação de entrada
      gsap.to(wrapRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "bounce.out",
      });

      // Impacto extra ao entrar no viewport
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            wrapRef.current,
            { y: 200, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "bounce.out" }
          );
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-md flex items-center justify-center"
    >
      {/* Glow laranja */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        aria-hidden
        style={{
          background:
            "radial-gradient(40% 40% at 60% 40%, rgba(255,104,49,0.45) 0%, rgba(255,104,49,0.15) 40%, transparent 70%)",
        }}
      />
      <Image
        src="/mockup-phone.svg"
        alt="Ettle app mockup"
        width={300}
        height={300}
        className="z-10 rounded-[1rem] will-change-transform drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
        // priority
      />
      <Image
        src="/screens/homeScreen.svg"
        alt="Ettle app mockup"
        width={266.95}
        height={580}
        className="absolute -z-0 rounded-[1rem] will-change-transform drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
        priority
      />
    </div>
  );
}

export default PhoneMockup;

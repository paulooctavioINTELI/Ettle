"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function PhoneMockup() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapRef.current || !imgRef.current) return;

    const ctx = gsap.context(() => {
      // Estado inicial: bem embaixo e invisível
      gsap.set(imgRef.current, {
        y: 300,
        opacity: 0,
        scale: 0.9,
      });

      // Animação de entrada de baixo para cima
      gsap.to(imgRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: "bounce.out", // efeito de impacto
      });

      // Efeito extra: quando a seção entra no scroll, reforça o impacto
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            imgRef.current,
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
      {/* Glow laranja forte para dar energia */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        aria-hidden
        style={{
          background:
            "radial-gradient(40% 40% at 60% 40%, rgba(255,104,49,0.45) 0%, rgba(255,104,49,0.15) 40%, transparent 70%)",
        }}
      />
      <Image
        ref={imgRef as any}
        src="/mockup-phone.png"
        alt="Ettle app mockup"
        width={300}
        height={300}
        className="h-auto rounded-[1rem] will-change-transform drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
        priority
      />
    </div>
  );
}

export default PhoneMockup;

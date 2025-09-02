"use client";

// PhoneCarousel.tsx

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Screen = { src: string; alt?: string };

type PhoneCarouselProps = {
  triggerIds: string[];
  screens: Screen[];
  width?: number;
  screenWidth?: number;
  screenHeight?: number;
  topOffset?: number;
  screenOffsetX?: number;
  screenOffsetY?: number;
  pinStartId?: string;
  pinEndId?: string;
  pinWithinId?: string; // fallback
};

export default function PhoneCarousel({
  triggerIds,
  screens,
  width = 266.95,
  screenWidth = 266.95,
  screenHeight = 580,
  topOffset = 84,
  screenOffsetX = 0,
  screenOffsetY = 0,
  pinStartId,
  pinEndId,
  pinWithinId,
}: PhoneCarouselProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef(0);

  // controle anti-"travada"
  const isAnimatingRef = useRef(false);
  const queuedIndexRef = useRef<number | null>(null);
  const parallaxEnabledRef = useRef(true);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // entrada do mockup
      gsap.set(wrap, {
        opacity: 0,
        y: 40,
        scale: 0.985,
        willChange: "transform,opacity",
      });
      gsap.to(wrap, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: prefersReduced ? 0 : 0.7,
        ease: "power3.out",
      });

      // pré-decodifica imagens para evitar travadas na 1ª troca
      slidesRef.current.forEach((img) => {
        try {
          img?.decode?.();
        } catch { }
      });

      // estado inicial dos slides (pilhados, anim. horizontal)
      slidesRef.current.forEach((img, i) => {
        gsap.set(img, {
          position: "absolute",
          inset: 0,
          margin: "auto",
          xPercent: i === 0 ? 0 : 100,
          y: 0,
          opacity: 1,
          zIndex: i === 0 ? 2 : 1,
          willChange: "transform",
          force3D: true,
          backfaceVisibility: "hidden",
        });
      });

      const animateTo = (fromIdx: number, toIdx: number) => {
        if (fromIdx === toIdx) return;

        // mata tweens antigos (evita conflitos ao rolar rápido)
        const incoming = slidesRef.current[toIdx];
        const outgoing = slidesRef.current[fromIdx];
        if (!incoming || !outgoing) return;

        gsap.killTweensOf([incoming, outgoing]); // kill tudo nesses elementos
        isAnimatingRef.current = true;
        parallaxEnabledRef.current = false; // pausamos o parallax durante a transição

        // define direção
        const forward = toIdx > fromIdx;

        gsap.set(incoming, { xPercent: forward ? 100 : -100, zIndex: 3 });
        gsap.set(outgoing, { zIndex: 2 });

        // se pular vários slides, aumente levemente a duração
        const hops = Math.abs(toIdx - fromIdx);
        const base = prefersReduced ? 0 : 0.5;
        const dur = Math.min(0.8, base + (hops - 1) * 0.12);

        const tl = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            gsap.set(outgoing, { zIndex: 1 });
            currentIndexRef.current = toIdx;
            isAnimatingRef.current = false;
            parallaxEnabledRef.current = true;

            // se houve um pedido enquanto animava, executa agora
            if (
              queuedIndexRef.current != null &&
              queuedIndexRef.current !== currentIndexRef.current
            ) {
              const next = queuedIndexRef.current;
              queuedIndexRef.current = null;
              animateTo(currentIndexRef.current, next);
            }
          },
        });

        tl.to(incoming, { xPercent: 0, duration: dur, ease: "power3.out" }, 0)
          .to(
            outgoing,
            {
              xPercent: forward ? -100 : 100,
              duration: dur,
              ease: "power3.in",
            },
            0
          );
      };

      const requestSlide = (index: number) => {
        const next = Math.max(
          0,
          Math.min(index, slidesRef.current.length - 1)
        );
        if (next === currentIndexRef.current) return;

        if (isAnimatingRef.current) {
          queuedIndexRef.current = next; // guarda o último pedido
          return;
        }
        animateTo(currentIndexRef.current, next);
      };

      // Parallax sutil no slide ativo (pausado durante transições)
      if (!prefersReduced) {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          onUpdate: () => {
            if (!parallaxEnabledRef.current) return;
            const active = slidesRef.current[currentIndexRef.current];
            if (!active) return;
            gsap.to(active, {
              y: gsap.utils.mapRange(
                0,
                window.innerHeight,
                0,
                -12,
                ScrollTrigger.positionInViewport(wrap, "top")
              ),
              duration: 0.18,
              ease: "none",
              overwrite: true,
            });
          },
        });
      }

      // PIN entre 1º e último feature (desktop)
      mm.add("(min-width: 768px)", () => {
        const startEl =
          (pinStartId && document.getElementById(pinStartId)) ||
          (triggerIds[0] && document.getElementById(triggerIds[0]));
        const endEl =
          (pinEndId && document.getElementById(pinEndId)) ||
          (triggerIds[triggerIds.length - 1] &&
            document.getElementById(triggerIds[triggerIds.length - 1]));

        let pinST: ScrollTrigger | null = null;

        if (startEl && endEl) {
          pinST = ScrollTrigger.create({
            trigger: startEl,
            start: `top top+=${topOffset}`,
            endTrigger: endEl,
            end: "bottom bottom",
            pin: wrap,
            pinSpacing: true,
          });
        } else {
          const container =
            (pinWithinId && document.getElementById(pinWithinId)) ||
            wrap.parentElement;
          if (container) {
            pinST = ScrollTrigger.create({
              trigger: container,
              start: `top top+=${topOffset}`,
              end: "bottom bottom",
              pin: wrap,
              pinSpacing: true,
            });
          }
        }

        return () => pinST?.kill();
      });

      // triggers de sincronização com as features
      const fTriggers: ScrollTrigger[] = [];
      triggerIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => requestSlide(idx),
          onEnterBack: () => requestSlide(idx),
        });
        fTriggers.push(st);
      });

      return () => {
        fTriggers.forEach((t) => t.kill());
      };
    }, wrapRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [
    triggerIds,
    screens.length,
    screenWidth,
    screenHeight,
    topOffset,
    screenOffsetX,
    screenOffsetY,
    pinStartId,
    pinEndId,
    pinWithinId,
  ]);

  return (
    <div
      ref={wrapRef}
      className={[
        "pointer-events-none",
        "relative",
        "w-full max-w-md",
        "ml-auto md:justify-self-end md:self-start",
        "z-10",
      ].join(" ")}
      // ⬇️ antes era: style={{ width }}
      style={{ width: "100%", maxWidth: width }}   // ✅ mobile fluido, desktop mantém 320px
      aria-label="Phone mockup carousel"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        aria-hidden
        style={{
          background:
            "radial-gradient(40% 40% at 60% 40%, rgba(255,104,49,0.45) 0%, rgba(255,104,49,0.15) 40%, transparent 70%)",
        }}
      />

      {/* Moldura */}
      <Image
        src="/mockup-phone.svg"
        alt="Phone frame"
        width={width}
        height={width}
        className="h-auto z-10 rounded-[1rem] drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)] select-none"
        priority
      />

      {/* Tela (centralizada com offset fino) */}
      <div
        className="absolute"
        style={{
          width: screenWidth,
          height: screenHeight,
          left: `calc(50% + ${screenOffsetX}px)`,
          top: `calc(50% + ${screenOffsetY}px)`,
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          borderRadius: "1rem",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {screens.map((s, i) => (
          <Image
            key={s.src + i}
            src={s.src}
            alt={s.alt || `App screen ${i + 1}`}
            width={screenWidth}
            height={screenHeight}
            className="absolute left-0 top-0 -z-10 object-cover will-change-transform"
            ref={(el) => {
              if (el) slidesRef.current[i] = el;
            }}
            // manter apenas o primeiro como prioridade para LCP
            priority={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

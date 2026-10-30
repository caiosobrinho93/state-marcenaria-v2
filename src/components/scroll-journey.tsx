"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

/** The supplied 60-frame walkthrough, driven by document scroll, never a timer. */
export default function ScrollJourney({ title }: { title: string }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const host = section.current!,
      surface = canvas.current!,
      ctx = surface.getContext("2d", { alpha: false });
    if (!ctx) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const reduced =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData;
    if (reduced) {
      host.dataset.motion = "reduced";
      return;
    }
    let disposed = false,
      target = 0,
      active = 0,
      queue: number[] = [],
      cleanup = () => {},
      lastPaint = -1;
    const mobile = innerWidth < 900,
      limit = mobile ? 18 : 28;
    const cache = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    const failed = new Set<number>();
    const size = () => {
      const rect = surface.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 1.5);
      surface.width = Math.round(rect.width * dpr);
      surface.height = Math.round(rect.height * dpr);
      lastPaint = -1;
      paint();
    };
    function paint() {
      if (disposed || !cache.size) return;
      const index = cache.has(target)
        ? target
        : [...cache.keys()].sort(
            (a, b) => Math.abs(a - target) - Math.abs(b - target),
          )[0];
      if (index === lastPaint) return;
      const img = cache.get(index)!;
      const scale = Math.max(
        surface.width / img.naturalWidth,
        surface.height / img.naturalHeight,
      );
      const w = img.naturalWidth * scale,
        h = img.naturalHeight * scale;
      ctx!.drawImage(
        img,
        (surface.width - w) * (mobile ? 0.2 + (index / 59) * 0.3 : 0.5),
        (surface.height - h) / 2,
        w,
        h,
      );
      lastPaint = index;
      host.dataset.frame = String(index + 1);
      host.dataset.ready = "true";
      const counter = host.querySelector("[data-frame-counter]");
      if (counter) counter.textContent = String(index + 1).padStart(2, "0");
    }
    function pump() {
      while (active < 3 && queue.length && !disposed) {
        const index = queue.shift()!;
        if (cache.has(index) || pending.has(index) || failed.has(index))
          continue;
        active++;
        pending.add(index);
        const img = new window.Image();
        img.decoding = "async";
        const finish = () => {
          active--;
          pending.delete(index);
          if (!disposed) pump();
        };
        img.onload = () => {
          if (disposed) {
            finish();
            return;
          }
          cache.set(index, img);
          if (cache.size > limit) {
            const farthest = [...cache.keys()].sort(
              (a, b) => Math.abs(b - target) - Math.abs(a - target),
            )[0];
            cache.delete(farthest);
          }
          paint();
          finish();
        };
        img.onerror = () => {
          failed.add(index);
          finish();
        };
        img.src = `/sequence/${mobile ? "mobile" : "desktop"}/frame_${String(index + 1).padStart(4, "0")}.webp`;
      }
    }
    function seek(progress: number) {
      target = Math.round(progress * 59);
      host.dataset.requestedFrame = String(target + 1);
      host.style.setProperty("--journey-progress", String(progress));
      host.dataset.chapter = String(
        progress < 0.21 ? 0 : progress < 0.48 ? 1 : progress < 0.76 ? 2 : 3,
      );
      const intro = Math.max(0, 1 - progress / 0.17);
      host.style.setProperty("--intro-opacity", String(intro));
      host.style.setProperty("--intro-offset", `${progress * -160}px`);
      queue = [];
      for (let delta = 0; delta <= 8; delta++)
        for (const n of delta ? [target + delta, target - delta] : [target])
          if (n >= 0 && n < 60 && !cache.has(n) && !pending.has(n))
            queue.push(n);
      paint();
      pump();
    }
    const observer = new ResizeObserver(size);
    observer.observe(surface);
    size();
    seek(0);
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const state = { progress: 0 };
        const tween = gsap.to(state, {
          progress: 1,
          ease: "none",
          onUpdate: () => seek(state.progress),
          scrollTrigger: {
            trigger: host,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });
        host.dataset.motion = "scroll";
        ScrollTrigger.refresh();
        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
    );
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup();
      cache.clear();
      queue = [];
    };
  }, []);
  const standard = title === "Ambientes que expressam sua essência.";
  return (
    <section
      ref={section}
      className="journey"
      data-chapter="0"
      data-frame="1"
      aria-label="Percurso imersivo da cozinha ao closet"
    >
      <div className="journey-stage">
        <h1 className="sr-only">{title}</h1>
        <div className="journey-backdrop"><Image
          className="journey-poster"
          src="/sequence/desktop/frame_0001.webp"
          alt="Percurso arquitetônico: cozinha em tons naturais integrada a um closet em madeira"
          fill
          priority
          sizes="100vw"
        /></div>
        <canvas ref={canvas} aria-hidden="true" className="journey-canvas" />
        <div className="journey-vignette" />
        <div className="journey-topline">
          <span>MARCENARIA AUTORAL / SOB MEDIDA</span>
          <span>VOTUPORANGA, SP · BRASIL</span>
        </div>
        <div className="journey-intro">
          <p className="eyebrow">A SUA VIDA. EM CADA DETALHE.</p>
          <div className="journey-title" aria-hidden="true">
            {standard ? (
              <>
                Ambientes que
                <br />
                expressam sua <em>essência.</em>
              </>
            ) : (
              title
            )}
          </div>
          <div className="journey-intro-bottom">
            <p>
              Espaços pensados para sentir.
              <br />E feitos para pertencer.
            </p>
            <a className="round-link" href="#contato">
              <span>Vamos criar o seu</span>
              <ArrowUpRight size={24} />
            </a>
          </div>
        </div>
        <div className="journey-chapter chapter-one" aria-hidden="true">
          <span className="chapter-index">01 — ENCONTRO</span>
          <h2>
            O cotidiano.
            <br />
            <em>Extraordinário.</em>
          </h2>
          <p>
            Proporções, texturas e luz.
            <br />O cuidado começa onde a vida acontece.
          </p>
        </div>
        <div className="journey-chapter chapter-two" aria-hidden="true">
          <span className="chapter-index">02 — CONEXÃO</span>
          <h2>
            O detalhe
            <br />
            abre <em>caminhos.</em>
          </h2>
          <p>
            A mesma essência.
            <br />
            Uma nova perspectiva a cada passo.
          </p>
        </div>
        <div className="journey-chapter chapter-three" aria-hidden="true">
          <span className="chapter-index">03 — INTIMIDADE</span>
          <h2>
            Entre.
            <br />O espaço é <em>seu.</em>
          </h2>
          <p>
            Organização que acolhe.
            <br />
            Marcenaria que faz parte de você.
          </p>
          <p className="journey-next">
            Continue para descobrir as possibilidades <ArrowDown size={18} />
          </p>
        </div>
        <div className="journey-bottom">
          <a href="#ambientes" className="scroll-prompt">
            <span className="scroll-wheel" />
            <span>ROLE PARA EXPLORAR</span>
          </a>
          <span className="journey-reference">
            ESTUDO VISUAL DE AMBIENTAÇÃO
          </span>
          <span className="journey-counter">
            <b data-frame-counter>01</b>
            <span>/ 60</span>
          </span>
        </div>
        <div className="journey-track">
          <span />
        </div>
        <div className="chapter-rail" aria-hidden="true">
          <span>COZINHA</span>
          <i />
          <span>PASSAGEM</span>
          <i />
          <span>CLOSET</span>
        </div>
      </div>
    </section>
  );
}

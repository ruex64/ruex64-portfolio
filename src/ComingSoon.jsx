import { useEffect, useRef } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { gsap } from "gsap";

export default function ComingSoon() {
  const brandRef = useRef(null);     // the "Ruex64" word (letters inside)
  const haloRef = useRef(null);      // the punch halo
  const soonRef = useRef(null);      // "Coming Soon"
  const iconsRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      const letters = brandRef.current.querySelectorAll("[data-letter]");

      // initial states
      gsap.set(letters, { y: -42, rotateZ: -3, opacity: 0, filter: "blur(4px)", willChange: "transform,opacity,filter" });
      gsap.set(haloRef.current, { opacity: 0, scale: 0.6, willChange: "transform,opacity" });
      gsap.set(soonRef.current, { opacity: 0, y: 14, scale: 0.98, willChange: "transform,opacity" });

      if (!reduce) {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // 1) letters drop -> compose the word
        tl.to(letters, {
          y: 0,
          rotateZ: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.06,
        });

        // 2) word-level impact (center-out) + halo burst
        tl.to(
          letters,
          { scale: 1.08, duration: 0.12, ease: "power2.out", transformOrigin: "50% 70%", stagger: { each: 0.02, from: "center" } },
          "-=0.18"
        )
          .to(
            letters,
            { scale: 1, duration: 0.28, ease: "power2.out", stagger: { each: 0.02, from: "center" } },
            ">"
          )
          .fromTo(
            haloRef.current,
            { opacity: 0, scale: 0.6 },
            { opacity: 0.16, scale: 2.2, duration: 0.34, ease: "power2.out" },
            "-=0.24"
          )
          .to(haloRef.current, { opacity: 0, duration: 0.24, ease: "power1.in" }, ">-0.06");

        // 3) Coming Soon reveal (below)
        tl.to(soonRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "expo.out" }, ">-0.05");

        // 4) social icons
        tl.from(iconsRef.current, { opacity: 0, y: 10, duration: 0.6, ease: "power2.out" }, ">-0.2");

        // clear transforms so no “twitch” later
        tl.add(() => letters.forEach(el => gsap.set(el, { clearProps: "transform,filter" })));
      } else {
        gsap.set(letters, { y: 0, rotateZ: 0, opacity: 1, filter: "none" });
        gsap.set(soonRef.current, { opacity: 1, y: 0, scale: 1 });
      }
    });

    return () => ctx.revert();
  }, []);

  const word = "Ruex64".split("");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* force vertical stacking & centering */}
      <div className="h-screen mx-auto max-w-screen-xl flex flex-col items-center justify-center gap-10 text-center">
        {/* logo + halo */}
        <div className="relative block">
          <div
            ref={haloRef}
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,90,31,0.20) 0%, rgba(255,90,31,0.10) 40%, rgba(255,90,31,0.00) 70%)",
              filter: "blur(8px)",
            }}
          />
          <h1 ref={brandRef} className="font-brand text-7xl md:text-8xl tracking-tight transform-gpu">
            {word.map((ch, i) => (
              <span key={i} data-letter className={ch === "x" ? "text-[#FF5A1F]" : ""}>
                {ch}
              </span>
            ))}
          </h1>
        </div>

        {/* Coming Soon BELOW the logo */}
        <div ref={soonRef} className="block">
          <p className="font-sub text-2xl md:text-3xl tracking-[0.18em]">Coming&nbsp;Soon!</p>
        </div>

        {/* socials */}
        <div ref={iconsRef} className="flex items-center justify-center gap-8 pt-2">
          <a href="https://github.com/ruex64" aria-label="GitHub" className="p-2 transition-transform hover:scale-110" target="_blank" rel="noreferrer">
            <Github size={28} strokeWidth={1.7} className="text-[#FF5A1F] hover:text-white" />
          </a>
          <a href="https://www.linkedin.com/in/ruex64/" aria-label="LinkedIn" className="p-2 transition-transform hover:scale-110" target="_blank" rel="noreferrer">
            <Linkedin size={28} strokeWidth={1.7} className="text-[#FF5A1F] hover:text-white" />
          </a>
          <a href="https://www.instagram.com/ruex64/" aria-label="Instagram" className="p-2 transition-transform hover:scale-110" target="_blank" rel="noreferrer">
            <Instagram size={28} strokeWidth={1.7} className="text-[#FF5A1F] hover:text-white" />
          </a>
        </div>
      </div>
    </main>
  );
}

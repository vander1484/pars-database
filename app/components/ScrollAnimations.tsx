"use client";

import { useEffect } from "react";

const REVEAL_SELECTORS = [
  ".currentSeasonHead",
  ".seasonDashboard > *",
  ".sectionIntro",
  ".grid > *",
  ".stats > *",
  ".archiveHero > *",
  ".compactHero > *",
  ".archiveContent > *",
  ".decadeGrid > *",
  ".competitionGrid > *",
  ".dataList > *",
  ".playerTableRow",
  ".searchResult",
  ".seasonStatGrid > *",
  ".leagueTableRow",
].join(",");

const TEXT_SELECTORS = [
  "main h1",
  "main h2",
  "main h3",
  "main .eyebrow",
  "main .sectionIntro > p",
  "main .archiveHero p",
  "main .compactHero p",
  "main .currentSeasonHead p",
  "main .homeFeatureHead p",
  "main .homeClosing p",
].join(",");

export default function ScrollAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    const updateProgress = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      root.style.setProperty("--page-scroll-progress", String(progress));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    if (reducedMotion.matches) {
      return () => {
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("resize", updateProgress);
      };
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));
    const textElements = Array.from(document.querySelectorAll<HTMLElement>(TEXT_SELECTORS));

    elements.forEach((element, index) => {
      element.classList.add("scrollReveal");
      element.style.setProperty("--scroll-delay", `${Math.min(index % 4, 3) * 55}ms`);
    });

    textElements.forEach((element, index) => {
      element.classList.add("textScrollReveal");
      element.style.setProperty("--text-reveal-delay", `${Math.min(index % 3, 2) * 45}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("scrollRevealVisible");
          element.classList.add("textScrollRevealVisible");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    [...elements, ...textElements].forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return <div className="pageScrollProgress" aria-hidden="true" />;
}

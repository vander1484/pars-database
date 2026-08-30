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

export default function ScrollAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS));

    elements.forEach((element, index) => {
      element.classList.add("scrollReveal");
      element.style.setProperty("--scroll-delay", `${Math.min(index % 4, 3) * 55}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("scrollRevealVisible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}

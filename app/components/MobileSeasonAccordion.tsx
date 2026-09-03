"use client";

import { useEffect } from "react";

const MOBILE_QUERY = "(max-width: 760px)";

function sectionLabel(section: HTMLElement) {
  if (section.classList.contains("transferSection")) return "Transfers";
  const heading = section.querySelector("h2");
  return heading?.textContent?.replace(/\s+/g, " ").trim() || "Season data";
}

function addToggle(section: HTMLElement) {
  if (section.dataset.mobileAccordionReady === "true") return;
  section.dataset.mobileAccordionReady = "true";
  section.classList.add("mobileSeasonPanel", "is-collapsed");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "mobileSeasonToggle";
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = `<span>${sectionLabel(section)}</span><span class="mobileSeasonChevron" aria-hidden="true">⌄</span>`;
  button.addEventListener("click", () => {
    const collapsed = section.classList.toggle("is-collapsed");
    button.setAttribute("aria-expanded", String(!collapsed));
  });
  section.prepend(button);
}

function enhanceSeasonPage() {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  if (!window.location.pathname.includes("/season")) return;

  const archive = document.querySelector<HTMLElement>(".archiveContent");
  if (!archive) return;

  archive.querySelectorAll<HTMLElement>(":scope > section").forEach((section) => {
    if (section.classList.contains("seasonExplore")) return;
    if (!section.querySelector("h2")) return;
    addToggle(section);
  });

  const statGrid = archive.querySelector<HTMLElement>(":scope > .seasonStatGrid");
  if (statGrid && !statGrid.closest(".mobileSeasonSummaryPanel")) {
    const wrapper = document.createElement("section");
    wrapper.className = "mobileSeasonSummaryPanel";
    statGrid.parentElement?.insertBefore(wrapper, statGrid);
    wrapper.appendChild(statGrid);
    addToggle(wrapper);
    const toggleLabel = wrapper.querySelector<HTMLElement>(".mobileSeasonToggle span:first-child");
    if (toggleLabel) toggleLabel.textContent = "Season summary";
  }
}

export default function MobileSeasonAccordion() {
  useEffect(() => {
    enhanceSeasonPage();
    const observer = new MutationObserver(enhanceSeasonPage);
    observer.observe(document.body, { childList: true, subtree: true });
    const media = window.matchMedia(MOBILE_QUERY);
    media.addEventListener("change", enhanceSeasonPage);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", enhanceSeasonPage);
    };
  }, []);

  return <style jsx global>{`
    .mobileSeasonToggle { display: none; }

    @media (max-width: 760px) {
      .archiveContent > .mobileSeasonPanel,
      .archiveContent > .mobileSeasonSummaryPanel {
        margin-bottom: 0.8rem !important;
        border: 1px solid rgba(16, 16, 16, 0.12);
        border-radius: 14px;
        overflow: hidden;
        background: #fff;
      }

      .mobileSeasonToggle {
        width: 100%;
        min-height: 56px;
        padding: 0.9rem 1rem;
        border: 0;
        border-bottom: 1px solid rgba(16, 16, 16, 0.09);
        background: #fff;
        color: #111;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .mobileSeasonToggle:active { background: #f7f5ef; }

      .mobileSeasonToggle > span:first-child {
        font-size: 1rem;
        font-weight: 800;
        line-height: 1.2;
      }

      .mobileSeasonChevron {
        flex: 0 0 auto;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        background: #f1f1ef;
        display: grid;
        place-items: center;
        font-size: 1.25rem;
        font-weight: 800;
        line-height: 1;
        transform: rotate(180deg);
        transition: transform 180ms cubic-bezier(.16,1,.3,1), background-color 180ms cubic-bezier(.16,1,.3,1);
      }

      .mobileSeasonToggle[aria-expanded="true"] .mobileSeasonChevron { background: #ebe7de; }

      .mobileSeasonPanel.is-collapsed > :not(.mobileSeasonToggle),
      .mobileSeasonSummaryPanel.is-collapsed > :not(.mobileSeasonToggle) {
        display: none !important;
      }

      .mobileSeasonPanel.is-collapsed .mobileSeasonToggle,
      .mobileSeasonSummaryPanel.is-collapsed .mobileSeasonToggle {
        border-bottom-color: transparent;
      }

      .mobileSeasonPanel.is-collapsed .mobileSeasonChevron,
      .mobileSeasonSummaryPanel.is-collapsed .mobileSeasonChevron {
        transform: rotate(0deg);
      }

      .mobileSeasonPanel > :not(.mobileSeasonToggle),
      .mobileSeasonSummaryPanel > :not(.mobileSeasonToggle) {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      .mobileSeasonPanel > h2,
      .mobileSeasonPanel .transferHead h2 {
        display: none;
      }

      .mobileSeasonPanel .transferHead,
      .mobileSeasonPanel .leagueTable,
      .mobileSeasonPanel .playerTable,
      .mobileSeasonPanel .dataList,
      .mobileSeasonSummaryPanel .seasonStatGrid {
        border-radius: 0;
      }

      .mobileSeasonPanel .transferHead,
      .mobileSeasonPanel > p,
      .mobileSeasonPanel > .leagueTable,
      .mobileSeasonPanel > .playerTable,
      .mobileSeasonPanel > .dataList,
      .mobileSeasonSummaryPanel .seasonStatGrid {
        padding-left: 0.85rem;
        padding-right: 0.85rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mobileSeasonChevron { transition: none !important; }
    }
  `}</style>;
}

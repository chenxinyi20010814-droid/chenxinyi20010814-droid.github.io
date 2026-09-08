(() => {
  const STYLE_ID = "flight-atlas-founding-milestones-style";

  function yearToLeft(year) {
    if (year <= 2006) return 1 + (year - 1999) * (9 / 7);
    if (year <= 2008) return 10 + (year - 2006) * 2;
    return 14 + (year - 2008) * (84 / 19);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .founding-legend {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #a9a49b;
        font-size: 13px;
      }

      .founding-marker {
        display: block;
        width: 12px;
        height: 12px;
        border: 2px solid #d4b777;
        border-radius: 50%;
        background: #0b0b0a;
        box-shadow: 0 0 0 3px rgba(212, 183, 119, 0.1);
      }

      .founding-node {
        position: absolute;
        z-index: 4;
        top: 56px;
        display: grid;
        place-items: center;
        width: 14px;
        height: 14px;
        padding: 0;
        border: 0;
        color: #c6b584;
        background: transparent;
        transform: translateX(-50%);
      }

      .founding-node.edge-start {
        transform: none;
      }

      .founding-node .founding-caption {
        position: absolute;
        bottom: 19px;
        left: 50%;
        color: #b9aa7e;
        font: 11px var(--font-geist-mono), monospace;
        letter-spacing: 0.04em;
        white-space: nowrap;
        transform: translateX(-50%);
      }

      .founding-node.edge-start .founding-caption {
        left: 0;
        transform: none;
      }

      .founding-node::after {
        content: attr(data-tooltip);
        position: absolute;
        z-index: 8;
        top: 23px;
        left: 50%;
        width: max-content;
        max-width: 190px;
        padding: 7px 9px;
        border: 1px solid rgba(212, 183, 119, 0.42);
        border-radius: 3px;
        color: #eee7d8;
        background: #242019;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.48);
        font: 11px var(--font-geist-sans), sans-serif;
        line-height: 1.4;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transform: translate(-50%, -3px);
        transition: opacity 140ms ease, transform 140ms ease;
      }

      .founding-node.edge-start::after {
        left: 0;
        transform: translate(0, -3px);
      }

      .founding-node:hover::after,
      .founding-node:focus-visible::after,
      .founding-node.is-open::after {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      .founding-node.edge-start:hover::after,
      .founding-node.edge-start:focus-visible::after,
      .founding-node.edge-start.is-open::after {
        transform: translate(0, 0);
      }

      .founding-node:focus-visible {
        outline: 1px solid #d4b777;
        outline-offset: 4px;
      }

      .founding-node.is-open .founding-marker {
        background: #d4b777;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureLegend() {
    const legend = document.querySelector(".timeline-legend");
    if (!legend || legend.querySelector(".founding-legend")) return;

    const item = document.createElement("span");
    item.className = "founding-legend";
    item.innerHTML = '<i class="founding-marker" aria-hidden="true"></i><span>公司成立</span>';
    legend.prepend(item);
  }

  function ensureNodes() {
    document.querySelectorAll(".timeline-row").forEach((row) => {
      const company = row.querySelector(".timeline-company strong")?.textContent?.trim();
      const foundingText = row.querySelector(".timeline-company span")?.textContent || "";
      const year = Number(foundingText.match(/(19|20)\d{2}/)?.[0]);
      const track = row.querySelector(".timeline-track");

      if (!company || !year || !track || track.querySelector(".founding-node")) return;

      const node = document.createElement("button");
      const left = yearToLeft(year);
      node.type = "button";
      node.className = `founding-node${left < 3 ? " edge-start" : ""}`;
      node.style.left = `${left}%`;
      node.dataset.tooltip = `${company} · ${year} 年成立`;
      node.setAttribute("aria-label", `${company}，${year} 年成立。`);
      node.innerHTML = '<span class="founding-caption">成立</span><span class="founding-marker" aria-hidden="true"></span>';
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        const wasOpen = node.classList.contains("is-open");
        document.querySelectorAll(".founding-node.is-open").forEach((item) => item.classList.remove("is-open"));
        if (!wasOpen) node.classList.add("is-open");
      });
      track.prepend(node);
    });
  }

  function enhanceTimeline() {
    ensureStyles();
    ensureLegend();
    ensureNodes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceTimeline, { once: true });
  } else {
    enhanceTimeline();
  }

  const observer = new MutationObserver(enhanceTimeline);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();

/* ============================================================
   fx.js — the interactive layer
   targeting reticle · section rail · text scramble · card tilt
   hero telemetry · live GitHub feed · keyboard map
   Runs after app.js. Degrades to nothing on touch / reduced motion.
   ============================================================ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ============================================================
     01. targeting reticle
     ============================================================ */
  function reticle() {
    const el = $("#reticle");
    if (!el || !FINE || REDUCED) return;

    const ring = $(".ring", el), dot = $(".dot", el), xy = $(".xy", el);
    const hairH = $(".hair.h", el), hairV = $(".hair.v", el);

    let tx = innerWidth / 2, ty = innerHeight / 2;   // target
    let rx = tx, ry = ty;                            // ring (eased)

    const HOT = "a, button, .card, input, textarea, select, [role='button'], [data-shell], .filter, .chan a";

    const label = (t) => {
      if (!t) return "";
      if (t.closest(".card")) return "OPEN";
      if (t.closest("input, textarea")) return "TYPE";
      if (t.closest("a[target='_blank']")) return "EXT";
      if (t.closest("a")) return "GOTO";
      if (t.closest("button, [role='button']")) return "EXEC";
      return "";
    };

    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      window.__pointer = { x: tx, y: ty, t: performance.now() };

      const hot = e.target.closest?.(HOT);
      el.classList.toggle("hot", !!hot);
      xy.textContent = hot ? label(e.target) : `${String(Math.round(tx)).padStart(4, "0")}:${String(Math.round(ty)).padStart(4, "0")}`;
    }, { passive: true });

    addEventListener("pointerdown", () => el.classList.add("down"));
    addEventListener("pointerup",   () => el.classList.remove("down"));
    addEventListener("pointerleave", () => { el.style.opacity = "0"; });
    addEventListener("pointerenter", () => { el.style.opacity = "1"; });

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      dot.style.transform  = `translate(${tx}px, ${ty}px)`;
      xy.style.transform   = `translate(${tx + 16}px, ${ty + 14}px)`;
      hairH.style.transform = `translateY(${ty}px)`;
      hairV.style.transform = `translateX(${tx}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ============================================================
     02. section rail
     ============================================================ */
  function rail() {
    const host = $("#rail-list"), fill = $("#rail-fill"), pct = $("#rail-pct");
    if (!host) return;

    const secs = ["about", "stack", "engine", "projects", "log", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    host.innerHTML = secs.map((s, i) =>
      `<li><a href="#${s.id}" data-i="${i}"><span class="lbl">${s.id}</span><i></i></a></li>`
    ).join("");

    const links = $$("a", host);

    const update = () => {
      const max = document.body.scrollHeight - innerHeight;
      const k = max > 0 ? Math.min(scrollY / max, 1) : 0;
      fill.style.height = (k * 100).toFixed(1) + "%";
      pct.textContent = String(Math.round(k * 100)).padStart(2, "0") + "%";

      let cur = -1;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) cur = i; });
      links.forEach((a, i) => a.classList.toggle("on", i === cur));
    };

    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update, { passive: true });
    update();
  }

  /* ============================================================
     03. text scramble — headings decode on entry
     ============================================================ */
  const CHARS = "!<>-_\\/[]{}—=+*^?#01ABCDEF%$&";

  function scramble(el) {
    const nodes = [];
    const walk = (n) => {
      for (const c of n.childNodes) {
        if (c.nodeType === 3 && c.nodeValue.trim()) nodes.push(c);
        else if (c.nodeType === 1) walk(c);
      }
    };
    walk(el);
    if (!nodes.length) return;

    const src = nodes.map((n) => n.nodeValue);
    const total = src.join("").length;
    const dur = Math.min(Math.ceil(total * 0.9) + 14, 90);
    let frame = 0;

    el.classList.add("scrambling");

    const tick = () => {
      const revealed = (frame / dur) * total * 1.35;
      let idx = 0;
      nodes.forEach((n, i) => {
        let out = "";
        for (let c = 0; c < src[i].length; c++, idx++) {
          const ch = src[i][c];
          out += ch === " " ? " " : (idx < revealed ? ch : CHARS[(Math.random() * CHARS.length) | 0]);
        }
        n.nodeValue = out;
      });

      if (frame++ < dur) requestAnimationFrame(tick);
      else {
        nodes.forEach((n, i) => (n.nodeValue = src[i]));
        el.classList.remove("scrambling");
      }
    };
    tick();
  }

  function scrambleWatch() {
    const targets = $$("[data-scramble]");
    if (!targets.length) return;
    if (REDUCED) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { scramble(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });

    targets.forEach((t) => io.observe(t));
  }

  /* ============================================================
     04. card tilt + pointer glare
     ============================================================ */
  function tilt() {
    const grid = $("#grid");
    if (!grid || !FINE || REDUCED) return;

    const reset = (card) => {
      card.style.transform = "";
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    };

    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      card.style.transform =
        `perspective(1000px) rotateX(${((0.5 - py) * 5).toFixed(2)}deg) rotateY(${((px - 0.5) * 6).toFixed(2)}deg) translateY(-5px)`;
    }, { passive: true });

    grid.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".card");
      if (card && card !== e.relatedTarget?.closest?.(".card")) reset(card);
    });
  }

  /* ============================================================
     05. hero telemetry — sparkline + clock
     ============================================================ */
  function telemetry() {
    const cv = $("#spark");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const N = 72;

    // seed with a plausible history so the panel reads "already running"
    const data = [];
    for (let i = 0, v = 0.4; i < N; i++) {
      v = Math.max(0.1, Math.min(0.94, v + (Math.random() - 0.5) * 0.24 + (Math.random() > 0.93 ? 0.4 : 0)));
      data.push(v);
    }

    let net = 0.6 + Math.random(), cpu = 14 + Math.random() * 30, pkt = 4800 + ((Math.random() * 3000) | 0), visible = true;

    const clock = $("#t-clock"), nEl = $("#t-net"), cEl = $("#t-cpu"), pEl = $("#t-pkt");
    nEl.textContent = net.toFixed(1);
    cEl.textContent = Math.round(cpu);
    pEl.textContent = pkt.toLocaleString();

    new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 }).observe(cv);

    const draw = () => {
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);

      const step = w / (N - 1);
      const y = (v) => h - 6 - v * (h - 14);

      // area
      ctx.beginPath();
      ctx.moveTo(0, h);
      data.forEach((v, i) => ctx.lineTo(i * step, y(v)));
      ctx.lineTo(w, h);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(43, 245, 164, 0.22)");
      g.addColorStop(1, "rgba(43, 245, 164, 0)");
      ctx.fillStyle = g;
      ctx.fill();

      // line
      ctx.beginPath();
      data.forEach((v, i) => (i ? ctx.lineTo(i * step, y(v)) : ctx.moveTo(0, y(v))));
      ctx.strokeStyle = "#2bf5a4";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(43, 245, 164, 0.7)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // head
      ctx.beginPath();
      ctx.arc(w - 1, y(data[N - 1]), 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "#ccfff0";
      ctx.fill();
    };

    const tick = () => {
      if (visible && !document.hidden) {
        // smoothed random walk with the occasional spike
        const spike = Math.random() > 0.94 ? Math.random() * 0.5 : 0;
        const next = Math.max(0.08, Math.min(0.96, data[N - 1] + (Math.random() - 0.5) * 0.22 + spike));
        data.push(next); data.shift();

        net = Math.max(0.1, net + (Math.random() - 0.5) * 0.7);
        cpu = Math.max(3, Math.min(97, cpu + (Math.random() - 0.5) * 9));
        pkt += Math.round(Math.random() * 40 + 8);

        nEl.textContent = net.toFixed(1);
        cEl.textContent = Math.round(cpu);
        pEl.textContent = pkt.toLocaleString();
        draw();
      }
      if (clock) clock.textContent = new Date().toLocaleTimeString("en-GB");
      setTimeout(tick, REDUCED ? 3000 : 480);
    };

    draw();
    tick();
  }

  /* ============================================================
     06. live GitHub data
     ============================================================ */
  const CACHE_KEY = "gh:monis115";
  const CACHE_TTL = 6 * 60 * 60 * 1000;

  const ago = (iso) => {
    const d = (Date.now() - new Date(iso)) / 86400000;
    if (d < 1) return "today";
    if (d < 2) return "yesterday";
    if (d < 31) return `${Math.floor(d)}d ago`;
    if (d < 365) return `${Math.floor(d / 30)}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
  };

  async function github() {
    let repos = null;

    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const c = JSON.parse(raw);
        if (Date.now() - c.at < CACHE_TTL) repos = c.repos;
      }
    } catch {}

    if (!repos) {
      try {
        const r = await fetch("https://api.github.com/users/monis115/repos?per_page=100&sort=pushed");
        if (!r.ok) throw new Error(r.status);
        const json = await r.json();
        repos = json.map((x) => ({
          name: x.name, pushed: x.pushed_at, stars: x.stargazers_count,
          lang: x.language, size: x.size, fork: x.fork
        }));
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos })); } catch {}
      } catch {
        return;   // offline or rate-limited: the static build stands on its own
      }
    }

    window.__GH = repos;
    document.dispatchEvent(new CustomEvent("gh:ready", { detail: repos }));
    paintFeed(repos);
    paintCards();
    paintStats(repos);
  }

  function paintFeed(repos) {
    const host = $("#feed");
    if (!host) return;
    const recent = repos.filter((r) => !r.fork).slice(0, 5);
    if (!recent.length) return;

    host.hidden = false;
    host.innerHTML = `<span class="f-lab">live // last pushed</span>` + recent.map((r) =>
      `<a href="https://github.com/monis115/${encodeURIComponent(r.name)}" target="_blank" rel="noopener"><i></i>${esc(r.name)} <b>${ago(r.pushed)}</b></a>`
    ).join("");
  }

  function paintCards() {
    const repos = window.__GH;
    if (!repos) return;
    $$("#grid .card").forEach((card) => {
      if (card.querySelector(".pushed")) return;
      const hit = repos.find((r) => r.name.toLowerCase() === card.dataset.id.toLowerCase());
      if (!hit) return;
      const foot = card.querySelector(".foot");
      const el = document.createElement("span");
      el.className = "pushed";
      el.innerHTML = `last push <b>${ago(hit.pushed)}</b>${hit.stars ? ` · ★ ${hit.stars}` : ""}`;
      foot.after(el);
    });
  }

  function paintStats(repos) {
    const n = repos.length;
    const el = $('.stat [data-count="41"]');
    if (el && n && n !== 41) { el.dataset.count = n; el.textContent = n; }
  }

  /* ============================================================
     07. keyboard map overlay
     ============================================================ */
  const KEYS = [
    ["`", "open / close the shell"],
    ["⌘K", "same, for the mouse-averse"],
    ["/", "jump to project search"],
    ["j / k", "move through project cards"],
    ["↵", "open the focused project"],
    ["?", "this map"],
    ["esc", "close anything open"],
    ["↑ ↓", "shell command history"],
    ["tab", "shell autocomplete"],
    ["↑↑↓↓←→←→ba", "…try it"]
  ];

  function keymap() {
    const box = $("#keys"), body = $("#keys-body");
    if (!box) return;

    body.innerHTML = KEYS.map(([k, d]) => `<div class="k"><kbd>${esc(k)}</kbd><span>${esc(d)}</span></div>`).join("");

    const close = () => box.classList.remove("open");
    $("#keys-close").onclick = close;
    box.addEventListener("mousedown", (e) => { if (e.target === box) close(); });

    addEventListener("keydown", (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
      if (e.key === "?" && !typing) { e.preventDefault(); box.classList.toggle("open"); }
      if (e.key === "Escape") close();
    });
  }

  /* ============================================================
     08. boot
     ============================================================ */
  function init() {
    reticle();
    rail();
    scrambleWatch();
    tilt();
    telemetry();
    keymap();
    github();

    // re-apply per-render enhancements when the grid changes
    document.addEventListener("projects:rendered", () => { paintCards(); });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();

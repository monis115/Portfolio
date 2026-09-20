/* ============================================================
   app.js — boot, atmosphere, render, shell
   Dependencies: none. Data comes from assets/js/data.js
   ============================================================ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- derived numbers ---------- */
  const YEARS = Math.floor((Date.now() - new Date(PROFILE.since)) / 31557600000);
  const LIVE_COUNT = PROJECTS.filter((p) => p.live).length;
  const REPO_COUNT = 41;
  const LANGS = 6;

  /* ============================================================
     01. boot sequence
     ============================================================ */
  function boot() {
    const el = $("#boot");
    const log = $("#boot-log");
    const bar = $("#boot-bar span");
    if (!el) return;

    const seen = sessionStorage.getItem("booted");
    const finish = () => {
      el.classList.add("done");
      document.body.classList.remove("is-locked");
      sessionStorage.setItem("booted", "1");
      setTimeout(() => el.remove(), 700);
      startHero();
    };

    if (seen || REDUCED) { finish(); return; }

    document.body.classList.add("is-locked");

    const lines = [
      "<b>[  OK  ]</b> initialising secure shell ...",
      "<b>[  OK  ]</b> mounting /dev/portfolio",
      "<b>[  OK  ]</b> loading kernel module: <i>monis.raza</i>",
      "<b>[  OK  ]</b> establishing uplink → github.com/monis115",
      `<b>[  OK  ]</b> indexing repositories ... <i>${REPO_COUNT} found</i>`,
      `<b>[  OK  ]</b> probing deployments ... <i>${LIVE_COUNT} live</i>`,
      "<b>[  OK  ]</b> decrypting stack manifest",
      "<b>[  OK  ]</b> injecting phosphor renderer",
      "<b>[  OK  ]</b> handshake complete",
      "",
      "<i>&gt;&gt; ACCESS GRANTED — welcome, operator.</i>"
    ];

    let i = 0;
    const tick = () => {
      if (i >= lines.length) { setTimeout(finish, 520); return; }
      log.insertAdjacentHTML("beforeend", lines[i] + "\n");
      bar.style.width = Math.round(((i + 1) / lines.length) * 100) + "%";
      i++;
      setTimeout(tick, i === lines.length ? 260 : 90 + Math.random() * 130);
    };
    setTimeout(tick, 240);

    const skip = () => finish();
    el.addEventListener("click", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
  }

  /* ============================================================
     02. matrix rain
     ============================================================ */
  function rain() {
    const cv = $("#rain");
    if (!cv || REDUCED) return;
    const ctx = cv.getContext("2d", { alpha: true });
    const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>[]{}/\\|=+*#$%&@ABCDEFGHJKLMNPQRSTUVWXYZ".split("");
    let cols = [], w = 0, h = 0, size = 15, dpr = Math.min(devicePixelRatio || 1, 2);

    const fit = () => {
      w = cv.width = Math.floor(innerWidth * dpr);
      h = cv.height = Math.floor(innerHeight * dpr);
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
      size = (innerWidth < 760 ? 13 : 16) * dpr;
      cols = new Array(Math.ceil(w / size)).fill(0).map(() => Math.random() * -60);
      ctx.font = `${size}px "JetBrains Mono", monospace`;
    };

    let last = 0;
    const draw = (t) => {
      requestAnimationFrame(draw);
      if (t - last < 55) return;           // ~18fps: calm, cheap, cinematic
      last = t;

      ctx.fillStyle = "rgba(4, 7, 10, 0.10)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols.length; i++) {
        const x = i * size;
        const y = cols[i] * size;
        const g = glyphs[(Math.random() * glyphs.length) | 0];

        // glyphs near the cursor burn brighter
        const pt = window.__pointer;
        const near = pt && Math.abs(pt.x * dpr - x) < 120 * dpr && Math.abs(pt.y * dpr - y) < 120 * dpr;

        ctx.fillStyle = near ? "#ccfff0" : "rgba(43, 245, 164, 0.95)";   // bright head
        ctx.fillText(g, x, y);
        ctx.fillStyle = "rgba(43, 245, 164, 0.22)";   // dim tail
        ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y - size);

        cols[i] = y > h && Math.random() > 0.975 ? 0 : cols[i] + 1;
      }
    };

    fit();
    addEventListener("resize", fit, { passive: true });

    // the rain belongs to the hero — it steps back once you start reading
    const dim = () => {
      if (cv.dataset.off === "1") return;
      const k = Math.min(scrollY / innerHeight, 1);
      cv.style.opacity = (0.26 - k * 0.18).toFixed(3);
    };
    addEventListener("scroll", dim, { passive: true });
    dim();

    requestAnimationFrame(draw);
  }

  /* ============================================================
     03. hero typing + counters
     ============================================================ */
  const ROLES = [
    "full stack developer // java · spring boot · angular",
    "java backend developer @ tata consultancy services",
    "solo build: campusconnect — angular 21 + spring boot 3.5 on aws",
    "founder — zorix lab",
    "500+ dsa problems solved"
  ];

  function startHero() {
    typeLoop();
    countWhenSeen();
    $$(".bar-fill").forEach((b) => { b.style.width = b.dataset.w + "%"; });
    const g = $(".glitch");
    if (g && !REDUCED) {
      setInterval(() => {
        g.classList.add("fire");
        setTimeout(() => g.classList.remove("fire"), 520);
      }, 5200);
    }
  }

  function typeLoop() {
    const out = $("#role");
    if (!out) return;
    let r = 0, i = 0, del = false;

    const step = () => {
      const txt = ROLES[r];
      i += del ? -1 : 1;
      out.textContent = txt.slice(0, i);

      let wait = del ? 26 : 46 + Math.random() * 40;
      if (!del && i === txt.length) { del = true; wait = 1900; }
      else if (del && i === 0) { del = false; r = (r + 1) % ROLES.length; wait = 340; }
      setTimeout(step, wait);
    };
    step();
  }

  function countWhenSeen() {
    const host = $(".stats");
    if (!host || REDUCED) { countUp(); return; }
    new IntersectionObserver((en, obs) => {
      if (en[0].isIntersecting) { countUp(); obs.disconnect(); }
    }, { threshold: 0.35 }).observe(host);
  }

  function countUp() {
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      let t0 = null;
      const run = (t) => {
        if (!t0) t0 = t;
        const k = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
        if (k < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  }

  /* ============================================================
     04. render: stack, projects, timeline
     ============================================================ */
  function renderStack() {
    const host = $("#stack-grid");
    if (!host) return;
    host.innerHTML = STACK.map((mod) => `
      <article class="mod rise">
        <h3>~/stack/${mod.group}</h3>
        ${mod.items.map((s) => `
          <div class="skill">
            <div class="skill-top"><b>${esc(s.name)}</b><span>${s.level}%</span></div>
            <div class="meter" data-level="${s.level}">${
              Array.from({ length: 10 }, (_, i) => `<i${i < Math.round(s.level / 10) ? ' class="on"' : ""}></i>`).join("")
            }</div>
          </div>`).join("")}
      </article>`).join("");
  }

  let shown = 9;
  const state = { cat: "all", q: "", sort: "curated", liveOnly: false };

  const SORTS = {
    curated: { label: "curated", fn: (a, b) => a.weight - b.weight },
    recent:  { label: "recent",  fn: (a, b) => b.year - a.year || a.weight - b.weight },
    az:      { label: "a→z",     fn: (a, b) => a.title.localeCompare(b.title) }
  };

  function matches(p, q) {
    if (!q) return true;
    const hay = `${p.id} ${p.title} ${p.tagline} ${p.desc} ${p.stack.join(" ")} ${p.cat}`.toLowerCase();
    // every term must land somewhere — cheap multi-word search
    return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
  }

  function visible() {
    return PROJECTS
      .filter((p) => state.cat === "all" || p.cat === state.cat)
      .filter((p) => !state.liveOnly || p.live)
      .filter((p) => matches(p, state.q))
      .sort(SORTS[state.sort].fn);
  }

  function renderFilters() {
    const host = $("#filters");
    if (!host) return;
    host.innerHTML = CATEGORIES.map((c) => {
      const n = c.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.cat === c.id).length;
      return `<button class="filter${c.id === state.cat ? " on" : ""}" data-cat="${c.id}">${c.glyph} ${c.label}<span class="c">${n}</span></button>`;
    }).join("");

    host.onclick = (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      state.cat = b.dataset.cat;
      shown = 9;
      renderFilters();
      renderProjects();
    };
  }

  function renderProjects() {
    const host = $("#grid");
    if (!host) return;
    const list = visible();
    const slice = list.slice(0, shown);

    const hits = $("#hits");
    if (hits) hits.textContent = `${list.length} / ${PROJECTS.length} targets`;

    if (!list.length) {
      host.innerHTML = `<div class="empty">no targets match <b>${esc(state.q)}</b><br><span style="font-size:11.5px">try a language, a city, or "live"</span></div>`;
      const m = $("#more"); if (m) m.style.display = "none";
      return;
    }

    host.innerHTML = slice.map((p, i) => `
      <article class="card rise" data-id="${p.id}" tabindex="0" role="button" aria-label="Open ${esc(p.title)}">
        <span class="glare"></span>
        <span class="card-idx">${String(i + 1).padStart(2, "0")}</span>
        <div class="card-cat">${esc(p.cat)} · ${p.year}</div>
        <h3>${esc(p.title)}</h3>
        <div class="tag-line">${esc(p.tagline)}</div>
        <p>${esc(p.desc)}</p>
        <div class="foot">
          <div class="pills">${p.stack.slice(0, 3).map((s) => `<span class="pill">${esc(s)}</span>`).join("")}</div>
          <span class="live-dot${p.live || p.caseStudy ? "" : " off"}"><i></i>${p.caseStudy ? "case study" : p.live ? "live" : (p.src ? "source" : "private")}</span>
        </div>
      </article>`).join("");

    const more = $("#more");
    if (more) {
      const left = list.length - slice.length;
      more.style.display = left > 0 ? "flex" : "none";
      const btn = $("#more button");
      if (btn) btn.textContent = `[ load_more — ${left} remaining ]`;
    }

    observe();
    document.dispatchEvent(new CustomEvent("projects:rendered"));
  }

  function renderLog() {
    const host = $("#log-list");
    if (!host) return;
    host.innerHTML = TIMELINE.map((t) => `
      <article class="log-item rise">
        <div class="log-meta"><span class="hash">commit ${t.hash}</span><span>${esc(t.date)}</span></div>
        <h3>${esc(t.title)}</h3>
        <div class="org">${esc(t.org)}</div>
        <p>${esc(t.body)}</p>
      </article>`).join("");
  }

  /* ============================================================
     05. project modal
     ============================================================ */
  function openProject(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    const m = $("#modal");

    $("#modal-path").textContent = `~/projects/${p.id}`;
    $("#modal-body").innerHTML = `
      <div class="card-cat">${esc(p.cat)} · ${p.year} · ${esc(p.id)}</div>
      <h3>${esc(p.title)}</h3>
      <div class="tag-line">${esc(p.tagline)}</div>
      <p style="margin-top:16px">${esc(p.desc)}</p>

      <div class="kv">
        ${p.metrics.map(([k, v]) => `<dl><dt>${esc(k)}</dt><dd>${esc(v)}</dd></dl>`).join("")}
        <dl><dt>stack</dt><dd>${esc(p.stack.join(" · "))}</dd></dl>
      </div>

      <div class="cta" style="margin-top:4px">
        ${p.caseStudy ? `<a class="btn" href="${p.caseStudy}">[ read_case_study → ]</a>` : ""}
        ${p.live ? `<a class="btn" href="${p.live}" target="_blank" rel="noopener">[ open_live ↗ ]</a>` : ""}
        ${p.src ? `<a class="btn ghost" href="${p.src}" target="_blank" rel="noopener">[ read_source ↗ ]</a>`
          : p.caseStudy ? "" : `<span class="btn ghost" style="cursor:default;opacity:.65">[ client-owned — source private ]</span>`}
      </div>

      ${p.live ? `
      <div class="preview" id="preview">
        <div class="load-btn">
          <button class="btn" id="load-preview">[ ./render_preview ]</button>
          <small>loads ${esc(p.live.replace(/^https?:\/\//, ""))} in a sandbox</small>
        </div>
      </div>` : ""}
    `;

    if (p.live) {
      $("#load-preview").onclick = () => {
        $("#preview").innerHTML = `<iframe src="${p.live}" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups" title="${esc(p.title)} preview"></iframe>`;
      };
    }

    m.classList.add("open");
    document.body.classList.add("is-locked");
    m.querySelector(".modal-box").scrollTop = 0;
  }

  function closeModal() {
    $("#modal").classList.remove("open");
    document.body.classList.remove("is-locked");
    setTimeout(() => { $("#modal-body").innerHTML = ""; }, 350);
  }

  /* ============================================================
     06. the shell — a real little command interpreter
     ============================================================ */
  const shell = {
    el: null, out: null, input: null, hist: [], hp: -1,

    init() {
      this.el = $("#shell");
      this.out = $("#shell-out");
      this.input = $("#shell-input");
      if (!this.el) return;

      this.input.addEventListener("keydown", (e) => {
        if (e.key.length === 1 || e.key === "Backspace") this.blip(520);
        if (e.key === "Enter") {
          this.blip(880);
          const v = this.input.value.trim();
          this.input.value = "";
          if (v) { this.hist.unshift(v); this.hp = -1; this.run(v); }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (this.hp < this.hist.length - 1) this.input.value = this.hist[++this.hp] || "";
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.hp = Math.max(this.hp - 1, -1);
          this.input.value = this.hp < 0 ? "" : this.hist[this.hp];
        } else if (e.key === "Tab") {
          e.preventDefault();
          const v = this.input.value.trim();
          const hit = Object.keys(this.cmds).find((c) => c.startsWith(v) && v);
          if (hit) this.input.value = hit + " ";
        } else if (e.key === "Escape") {
          this.close();
        }
      });

      $("#shell-close").onclick = () => this.close();
      this.el.addEventListener("mousedown", (e) => { if (e.target === this.el) this.close(); });
      this.banner();
    },

    open() {
      this.el.classList.add("open");
      document.body.classList.add("is-locked");
      setTimeout(() => this.input.focus(), 120);
    },

    close() {
      this.el.classList.remove("open");
      document.body.classList.remove("is-locked");
    },

    toggle() { this.el.classList.contains("open") ? this.close() : this.open(); },

    print(html, cls = "") {
      this.out.insertAdjacentHTML("beforeend", `<div class="ln ${cls}">${html}</div>`);
      this.out.scrollTop = this.out.scrollHeight;
    },

    gap() { this.out.insertAdjacentHTML("beforeend", '<div class="sp"></div>'); },

    banner() {
      this.print(`<span class="head">monis@portfolio — interactive shell v2.0</span>`);
      this.print(`<span class="dim">Java · Spring Boot · Angular — ${REPO_COUNT} repositories indexed, ${LIVE_COUNT} live, ${YEARS} years of commits</span>`);
      this.print(`<span class="dim">type <span class="ok">help</span> for the command list, <span class="ok">esc</span> to close.</span>`);
      this.gap();
    },

    run(line) {
      this.print(`<span class="cmd"><span class="p">monis@portfolio:~$</span> ${esc(line)}</span>`);
      const [cmd, ...args] = line.split(/\s+/);
      const fn = this.cmds[cmd.toLowerCase()];
      if (fn) fn.call(this, args);
      else this.print(`<span class="err">command not found: ${esc(cmd)}</span> <span class="dim">— try 'help'</span>`);
      this.gap();
    },

    cmds: {
      help() {
        const rows = [
          ["whoami",        "identity and current posting"],
          ["about",         "the long version"],
          ["awards",        "citations and competitive record"],
          ["cat resume",    "the whole CV, as text"],
          ["man flag",      "there is a flag hidden on this box"],
          ["ls [cat]",      "list projects — platform | backend | site | app | lab"],
          ["open <name>",   "open a project (live build if deployed)"],
          ["cat <name>",    "print a project's dossier"],
          ["stack",         "capability matrix"],
          ["log",           "career git log"],
          ["contact",       "channels and how to reach me"],
          ["resume",        "download the CV"],
          ["social",        "github · linkedin · instagram · zorix lab"],
          ["goto <sec>",    "scroll to a section"],
          ["ping <name>",   "measure real latency to a deployment"],
          ["gh",            "live stats straight from the GitHub API"],
          ["theme <name>",  "green · amber · cyan · crimson"],
          ["sound",         "keyclick on/off"],
          ["neofetch",      "system readout"],
          ["date / uptime", "clock and years on the keyboard"],
          ["clear",         "wipe the buffer"],
          ["exit",          "close the shell"]
        ];
        this.print('<span class="head">AVAILABLE COMMANDS</span>');
        rows.forEach(([c, d]) => this.print(`  <span class="ok">${esc(c.padEnd(15))}</span><span class="dim">${esc(d)}</span>`));
      },

      whoami() {
        this.print(`<span class="ok">${PROFILE.fullName}</span> <span class="dim">— ${PROFILE.role} · ${PROFILE.focus}</span>`);
        this.print(`<span class="dim">posting   :</span> ${PROFILE.title}`);
        this.print(`<span class="dim">employer  :</span> ${PROFILE.company}`);
        this.print(`<span class="dim">venture   :</span> ${PROFILE.venture}`);
        this.print(`<span class="dim">education :</span> B.Tech CSE — Narula Institute of Technology, Kolkata (8.71)`);
        this.print(`<span class="dim">location  :</span> ${PROFILE.location}`);
        this.print(`<span class="dim">since     :</span> first public commit ${PROFILE.since}`);
      },

      about() {
        this.print('<span class="dim">Full-stack developer: Java / Spring Boot on the back, Angular on the front.</span>');
        this.print('<span class="dim">Two years at Tata Consultancy Services building enterprise systems in</span>');
        this.print('<span class="dim">financial services. What that code does belongs to the client, so it is</span>');
        this.print('<span class="dim">not on this page — but it is work where correctness is the whole job.</span>');
        this.print('<span class="dim">What I can show you, I own: CampusConnect runs nine role-based dashboards</span>');
        this.print('<span class="dim">on Angular 21 + Spring Boot 3.5, 35+ REST controllers, MySQL on AWS RDS,</span>');
        this.print('<span class="dim">S3 documents, PDF/Excel pipelines, shipped as a PWA on Beanstalk.</span>');
        this.print(`<span class="dim">Plus ${REPO_COUNT} public repositories, ${LIVE_COUNT} of them live, and 500+ DSA problems.</span>`);
        this.print('<span class="dim">Citations: two GEM awards and an Employee of the Month at TCS.</span>');
      },

      awards() {
        this.print('<span class="head">CITATIONS</span>');
        this.print('  <span class="warn">GEM</span> <span class="dim">— top performer, TCS Foundation Training, Trivandrum</span>');
        this.print('  <span class="warn">GEM</span> <span class="dim">— project implementation, for consistent change delivery</span>');
        this.print('  <span class="warn">EOTM</span> <span class="dim">— Employee of the Month, delivery quality in production</span>');
        this.print('  <span class="ok">DSA</span> <span class="dim">— 500+ solved · LeetCode 240+ · CodeChef 190+ · HackerRank 5★</span>');
      },

      ls(args) {
        const cat = (args[0] || "").toLowerCase();
        let list = PROJECTS.slice().sort((a, b) => a.weight - b.weight);
        if (cat && cat !== "all") {
          list = list.filter((p) => p.cat === cat);
          if (!list.length) { this.print(`<span class="err">no such category: ${esc(cat)}</span>`); return; }
        }
        this.print(`<span class="dim">total ${list.length}</span>`);
        list.forEach((p) => {
          const flag = p.live ? '<span class="ok">live  </span>'
            : p.src ? '<span class="warn">src   </span>'
            : '<span class="dim">priv  </span>';
          this.print(`  ${flag}<span class="dim">${String(p.year)}</span>  <span class="ok">${esc(p.id)}</span> <span class="dim">— ${esc(p.tagline)}</span>`);
        });
        this.print(`<span class="dim">hint: open &lt;name&gt; · cat &lt;name&gt;</span>`);
      },

      cat(args) {
        const q = args.join(" ").toLowerCase().replace(/\.txt$/, "");
        if (["resume", "cv", "resume.txt", "~/resume"].includes(q)) { this.cmds.resumeText.call(this); return; }
        const p = findProject(args.join(" "));
        if (!p) { this.print('<span class="err">no such project</span>'); return; }
        this.print(`<span class="head">${esc(p.title)}</span> <span class="dim">(${esc(p.id)})</span>`);
        this.print(`<span class="dim">${esc(p.desc)}</span>`);
        this.print(`<span class="dim">stack:</span> ${esc(p.stack.join(", "))}`);
        if (p.live) this.print(`<span class="dim">live :</span> <a href="${p.live}" target="_blank" rel="noopener">${esc(p.live)}</a>`);
        if (p.src) this.print(`<span class="dim">src  :</span> <a href="${p.src}" target="_blank" rel="noopener">${esc(p.src)}</a>`);
        else this.print('<span class="dim">src  :</span> <span class="warn">client-owned — not public</span>');
        if (p.caseStudy) this.print(`<span class="dim">case :</span> <a href="${p.caseStudy}">${esc(p.caseStudy)}</a>`);
      },

      resumeText() {
        const L = [
          ['head', 'MD MONIS RAZA — FULL STACK DEVELOPER'],
          ['dim',  'Java / Spring Boot & Angular · New Delhi, India'],
          ['dim',  `${PROFILE.phone} · ${PROFILE.email}`],
          ['rule', ''],
          ['ok',   'SUMMARY'],
          ['dim',  '  Full-stack developer with 2+ years at TCS building enterprise systems'],
          ['dim',  '  in financial services, plus solo delivery of CampusConnect — a multi-role'],
          ['dim',  '  admission platform built end-to-end with Angular 21 and Spring Boot 3.5'],
          ['dim',  '  on AWS, covering UI, REST APIs, database design and cloud deployment.'],
          ['dim',  '  500+ DSA problems solved.'],
          ['rule', ''],
          ['ok',   'EXPERIENCE'],
          ['warn', '  Tata Consultancy Services — Java Backend Developer'],
          ['dim',  '  Oct 2024 – present'],
          ['dim',  '    · Backend engineering on enterprise systems in financial services'],
          ['dim',  '    · Java, JDBC and PostgreSQL, to production standards'],
          ['dim',  '    · Two GEM awards and Employee of the Month for delivery quality'],
          ['warn', '    · Project specifics withheld — client confidentiality'],
          ['sp',   ''],
          ['warn', '  Rare Education Private Limited — Full-Stack Developer (freelance)'],
          ['dim',  '  Jun 2025 – Dec 2025 · CampusConnect'],
          ['dim',  '    · Built the platform solo: Angular 21 front end, Spring Boot 3.5 API'],
          ['dim',  '    · 9 role-based dashboards, Angular Material, RxJS, route guards'],
          ['dim',  '    · 4-layer backend, Spring Data JPA over MySQL on AWS RDS,'],
          ['dim',  '      35+ REST controllers across admissions, finance, visas, documents'],
          ['dim',  '    · S3 storage, iText PDFs, Apache POI exports, Spring Mail,'],
          ['dim',  '      scheduled interest accrual'],
          ['dim',  '    · Angular Service Worker + SSR (PWA); Docker → Elastic Beanstalk'],
          ['dim',  '      behind Nginx with HTTPS and Actuator health checks'],
          ['sp',   ''],
          ['warn', '  Grace Hospital — MedCore, Hospital Billing System'],
          ['dim',  '  Jan 2026 – Mar 2026'],
          ['dim',  '    · REST APIs for patient, doctor and billing management'],
          ['dim',  '    · Automated PDF invoicing, H2 in-memory database'],
          ['rule', ''],
          ['ok',   'TRAINING & ACHIEVEMENTS'],
          ['dim',  '  · GEM award — top performer, TCS Foundation Training, Trivandrum'],
          ['dim',  '  · GEM award — project implementation, consistent change delivery'],
          ['dim',  '  · Employee of the Month — delivery quality in production'],
          ['rule', ''],
          ['ok',   'TECHNICAL SKILLS'],
          ['dim',  '  Languages  Java, TypeScript/JavaScript, SQL, HTML5, CSS/SCSS'],
          ['dim',  '  Frontend   Angular 21, Angular Material, Angular CDK, RxJS,'],
          ['dim',  '             Angular SSR (Express), Chart.js / ng2-charts'],
          ['dim',  '  Backend    Spring Boot 3.5, Spring Data JPA/Hibernate, Spring Mail,'],
          ['dim',  '             Spring AOP, Spring Actuator, JDBC, REST APIs'],
          ['dim',  '  Databases  MySQL, PostgreSQL, H2'],
          ['dim',  '  Compete    LeetCode 240+ · CodeChef 190+ · HackerRank 5★'],
          ['rule', ''],
          ['ok',   'EDUCATION'],
          ['dim',  '  B.Tech, Computer Science — Narula Institute of Technology, Kolkata'],
          ['dim',  '  CGPA 8.71 · 2020–2024'],
          ['rule', ''],
          ['dim',  '  Full PDF on request — some client detail is not public.']
        ];
        L.forEach(([k, t]) => {
          if (k === "sp") this.gap();
          else if (k === "rule") this.print('<span class="dim">──────────────────────────────────────────────────────────────</span>');
          else this.print(`<span class="${k}">${esc(t)}</span>`);
        });
      },

      open(args) {
        const q = args.join(" ");
        if (!q) { this.print('<span class="err">usage: open &lt;project&gt;</span>'); return; }
        const p = findProject(q);
        if (!p) { this.print(`<span class="err">no such project: ${esc(q)}</span>`); return; }
        const url = p.live || p.src || p.caseStudy;
        if (!url) { this.print(`<span class="warn">${esc(p.title)} is client-owned — no public URL. Try 'cat ${esc(p.id)}'.</span>`); return; }
        if (url === p.caseStudy) { this.print('<span class="ok">opening the case study …</span>'); location.href = url; return; }
        this.print(`<span class="ok">launching</span> <span class="dim">${esc(url)}</span>`);
        window.open(url, "_blank", "noopener");
      },

      stack() {
        STACK.forEach((mod) => {
          this.print(`<span class="head">~/stack/${mod.group}</span>`);
          mod.items.forEach((s) => {
            const n = Math.round(s.level / 10);
            this.print(`  <span class="dim">${s.name.padEnd(14)}</span><span class="ok">${"█".repeat(n)}</span><span class="dim">${"░".repeat(10 - n)} ${s.level}%</span>`);
          });
        });
      },

      log() {
        TIMELINE.forEach((t) => {
          this.print(`<span class="warn">commit ${t.hash}</span>`);
          this.print(`<span class="dim">Date:   ${t.date}</span>`);
          this.print(`    <span class="ok">${esc(t.title)}</span> <span class="dim">— ${esc(t.org)}</span>`);
        });
      },

      contact() {
        this.print(`<span class="dim">email    :</span> <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>`);
        this.print(`<span class="dim">phone    :</span> <a href="tel:${PROFILE.phone.replace(/[^+\d]/g, "")}">${PROFILE.phone}</a>`);
        this.print(`<span class="dim">linkedin :</span> <a href="${PROFILE.links.linkedin}" target="_blank" rel="noopener">monis-raza</a>`);
        this.print(`<span class="dim">github   :</span> <a href="${PROFILE.links.github}" target="_blank" rel="noopener">@${PROFILE.handle}</a>`);
        this.print(`<span class="dim">studio   :</span> <a href="${PROFILE.links.zorix}" target="_blank" rel="noopener">zorixlab.com</a>`);
        this.print(`<span class="ok">open for freelance builds and interesting problems.</span>`);
      },

      resume() {
        if (PROFILE.links.resume) {
          this.print('<span class="ok">fetching CV …</span>');
          window.open(PROFILE.links.resume, "_blank", "noopener");
          return;
        }
        this.print('<span class="warn">the PDF is not hosted publicly — parts of it are covered by client confidentiality.</span>');
        this.print(`<span class="dim">Ask and I'll send it: <a href="mailto:${PROFILE.email}?subject=R%C3%A9sum%C3%A9%20request">${PROFILE.email}</a></span>`);
        this.print('<span class="dim">The shareable version is right here — run <span class="ok">cat resume.txt</span>.</span>');
      },

      social() { this.cmds.contact.call(this); },

      goto(args) {
        const id = (args[0] || "").replace(/^[#./]+/, "");
        const t = document.getElementById(id);
        if (!t) { this.print('<span class="err">sections: about · stack · projects · log · contact</span>'); return; }
        this.close();
        t.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      },

      neofetch() {
        const rows = [
          ["operator", PROFILE.fullName],
          ["role", `${PROFILE.role} — ${PROFILE.focus}`],
          ["posting", PROFILE.title],
          ["studio", PROFILE.venture],
          ["host", "monis115.github.io"],
          ["uptime", `${YEARS} years, ${REPO_COUNT} repositories`],
          ["stack", "Java 21 · Spring Boot 3.5 · Angular 21 · AWS"],
          ["data", "MySQL · PostgreSQL · H2"],
          ["dsa", "500+ solved · LC 240+ · HR 5★"],
          ["location", PROFILE.location]
        ];
        this.print('<span class="ok">    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄</span>');
        rows.forEach(([k, v], i) => {
          const art = ["   ▄█▀          ▀█▄", "  █▀   ▄▄    ▄▄   ▀█", " █▌   ███    ███   ▐█", " █▌    ▀▀    ▀▀    ▐█", " █▌    ▄▄▄▄▄▄▄▄    ▐█", "  █▄   ▀▀▀▀▀▀   ▄█", "   ▀█▄▄      ▄▄█▀", "     ▀▀██████▀▀", "        ▀▀▀▀", "          "][i] || "          ";
          this.print(`<span class="ok">${art.padEnd(24)}</span><span class="head">${k.padEnd(10)}</span><span class="dim">${esc(v)}</span>`);
        });
      },

      date() { this.print(`<span class="dim">${new Date().toString()}</span>`); },

      uptime() {
        const d = Math.floor((Date.now() - new Date(PROFILE.since)) / 86400000);
        this.print(`<span class="dim">up ${d.toLocaleString()} days — first commit ${PROFILE.since}, and the streak held.</span>`);
      },

      sudo(args) {
        if (!args.length) { this.print('<span class="err">usage: sudo &lt;command&gt;</span>'); return; }
        this.print('<span class="warn">[sudo] password for guest:</span> <span class="dim">••••••••</span>');
        this.print('<span class="err">guest is not in the sudoers file. This incident has been reported.</span>');
        this.print('<span class="dim">… to me, personally. Hire me and we can talk about root.</span>');
      },

      rm(args) {
        if (args.join(" ").includes("-rf")) {
          this.print('<span class="err">nice try, operator.</span> <span class="dim">this filesystem is read-only and so is my patience.</span>');
        } else this.print('<span class="dim">nothing to remove.</span>');
      },

      matrix() {
        const cv = $("#rain");
        if (!cv) return;
        const on = cv.dataset.off !== "1";
        cv.dataset.off = on ? "1" : "0";
        cv.style.opacity = on ? "0" : "0.26";
        this.print(`<span class="ok">rain ${on ? "disabled" : "enabled"}</span>`);
      },

      hack() {
        const t = ["scanning subnet 10.0.0.0/24 …", "bypassing firewall …", "injecting payload …", "escalating privileges …", "ACCESS GRANTED"];
        t.forEach((s, i) => setTimeout(() => this.print(`<span class="${i === t.length - 1 ? "ok" : "dim"}">${s}</span>`), i * 420));
        setTimeout(() => this.print('<span class="dim">…that was a progress bar. The real work is in ./projects.</span>'), t.length * 420 + 200);
      },

      async ping(args) {
        const p = findProject(args.join(" "));
        if (!p) { this.print('<span class="err">usage: ping &lt;project&gt;</span>'); return; }
        const url = p.live || p.src;
        if (!url) { this.print('<span class="warn">no public endpoint to probe.</span>'); return; }
        this.print(`<span class="dim">PING ${esc(url)}</span>`);

        let best = Infinity, ok = 0;
        for (let i = 0; i < 3; i++) {
          const t0 = performance.now();
          try {
            await fetch(url, { mode: "no-cors", cache: "no-store" });
            const ms = Math.round(performance.now() - t0);
            best = Math.min(best, ms); ok++;
            this.print(`  <span class="ok">reply</span> <span class="dim">seq=${i + 1} time=${ms}ms</span>`);
          } catch {
            this.print(`  <span class="err">timeout</span> <span class="dim">seq=${i + 1}</span>`);
          }
        }
        this.print(ok
          ? `<span class="dim">3 sent, ${ok} received, best <span class="ok">${best}ms</span> — the node is up.</span>`
          : '<span class="warn">no reply — the browser blocked the probe, not the server.</span>');
      },

      gh() {
        const repos = window.__GH;
        if (!repos) { this.print('<span class="warn">live GitHub data not loaded (offline or rate-limited).</span>'); return; }
        const stars = repos.reduce((n, r) => n + r.stars, 0);
        const langs = [...new Set(repos.map((r) => r.lang).filter(Boolean))];
        const mb = Math.round(repos.reduce((n, r) => n + r.size, 0) / 1024);
        this.print('<span class="head">LIVE FROM api.github.com</span>');
        this.print(`<span class="dim">repositories :</span> ${repos.length}`);
        if (stars) this.print(`<span class="dim">stars        :</span> ${stars}`);
        this.print(`<span class="dim">languages    :</span> ${esc(langs.join(", "))}`);
        this.print(`<span class="dim">code on disk :</span> ~${mb} MB`);
        this.print('<span class="dim">recent pushes:</span>');
        repos.filter((r) => !r.fork).slice(0, 5).forEach((r) => {
          const d = Math.floor((Date.now() - new Date(r.pushed)) / 86400000);
          this.print(`  <span class="ok">${esc(r.name)}</span> <span class="dim">${d === 0 ? "today" : d + "d ago"}</span>`);
        });
      },

      theme(args) {
        const t = (args[0] || "").toLowerCase();
        const THEMES = {
          green:   ["#2bf5a4", "#35d6ff"],
          amber:   ["#ffb454", "#ff8f40"],
          cyan:    ["#35d6ff", "#7aa2ff"],
          crimson: ["#ff5470", "#ff9a8b"]
        };
        if (!THEMES[t]) { this.print(`<span class="err">themes: ${Object.keys(THEMES).join(" · ")}</span>`); return; }
        applyTheme(t, THEMES[t]);
        try { localStorage.setItem("theme", t); } catch {}
        this.print(`<span class="ok">phosphor set to ${esc(t)}</span>`);
      },

      sound() {
        this.sfx = !this.sfx;
        try { localStorage.setItem("sfx", this.sfx ? "1" : "0"); } catch {}
        this.print(`<span class="ok">keyclick ${this.sfx ? "enabled" : "disabled"}</span>`);
        if (this.sfx) this.blip(880);
      },

      man(args) {
        if ((args[0] || "").toLowerCase() !== "flag") {
          this.print('<span class="dim">manual pages: <span class="ok">man flag</span></span>');
          return;
        }
        this.print('<span class="head">FLAG(1)                     PORTFOLIO                     FLAG(1)</span>');
        this.gap();
        this.print('<span class="ok">NAME</span>');
        this.print('<span class="dim">    flag — assemble the three fragments hidden on this box</span>');
        this.gap();
        this.print('<span class="ok">SYNOPSIS</span>');
        this.print('<span class="dim">    flag MONIS{...}</span>');
        this.gap();
        this.print('<span class="ok">DESCRIPTION</span>');
        this.print('<span class="dim">    Three fragments. Join them in order, submit with \'flag\'.</span>');
        this.print('<span class="dim">    Solving it unlocks a command you cannot otherwise run.</span>');
        this.gap();
        this.print('<span class="ok">HINTS</span>');
        this.print('<span class="warn">    1/3</span> <span class="dim">crawlers know where to look. So do you.</span>');
        this.print('<span class="warn">    2/3</span> <span class="dim">the oldest trick on the web: read the page itself.</span>');
        this.print('<span class="warn">    3/3</span> <span class="dim">not in any file. Ask the admission pipeline for something</span>');
        this.print('<span class="dim">        no student should ever be able to ask for.</span>');
        this.gap();
        this.print('<span class="dim">    No scraping, no brute force, no server to attack. Just reading.</span>');
      },

      flag(args) {
        const guess = args.join("").replace(/\s+/g, "").toLowerCase();
        if (!guess) { this.print('<span class="err">usage: flag MONIS{...}</span>'); return; }

        if (guess === "monis{c4mpus_r0l3_g4t3}") {
          try { localStorage.setItem("root", "1"); } catch {}
          this.print('<span class="dim">verifying .................. </span><span class="ok">MATCH</span>');
          this.print('<span class="dim">escalating privileges ...... </span><span class="ok">OK</span>');
          this.gap();
          this.print('<span class="head">╔══════════════════════════════════════════════╗</span>');
          this.print('<span class="head">║  CLEARANCE: ROOT — you read everything.      ║</span>');
          this.print('<span class="head">╚══════════════════════════════════════════════╝</span>');
          this.gap();
          this.print('<span class="dim">You now have the <span class="ok">hire</span> command. It was always the point.</span>');
          rootBadge();
        } else if (guess.startsWith("monis{")) {
          const parts = ["c4mpus", "r0l3", "g4t3"].filter((p) => guess.includes(p)).length;
          this.print(`<span class="warn">close — ${parts}/3 fragments recognised.</span> <span class="dim">order matters, joined by underscores.</span>`);
        } else {
          this.print('<span class="err">rejected.</span> <span class="dim">the flag looks like MONIS{...} — run \'man flag\'.</span>');
        }
      },

      hire() {
        let unlocked = false;
        try { unlocked = localStorage.getItem("root") === "1"; } catch {}
        if (!unlocked) {
          this.print('<span class="err">permission denied.</span> <span class="dim">this command needs root. run \'man flag\'.</span>');
          return;
        }
        this.print('<span class="head">// WHY ME — the short version</span>');
        this.gap();
        this.print('<span class="dim">Two years writing backend code for production financial systems, where</span>');
        this.print('<span class="dim">being nearly right is the same as being wrong. Then, alone, a nine-role</span>');
        this.print('<span class="dim">admission platform on Angular 21 + Spring Boot 3.5, from the first</span>');
        this.print('<span class="dim">migration to the Beanstalk deploy — because nobody else was going to.</span>');
        this.gap();
        this.print('<span class="dim">I finish things. This page is evidence: no framework, no build step,</span>');
        this.print('<span class="dim">and a flag you had to actually read the source to find.</span>');
        this.gap();
        this.print(`<span class="ok">email   </span> <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>`);
        this.print(`<span class="ok">phone   </span> <a href="tel:${PROFILE.phone.replace(/[^+\d]/g, "")}">${PROFILE.phone}</a>`);
        this.print(`<span class="ok">résumé  </span> <span class="dim">ask by email — or run 'cat resume.txt'</span>`);
        this.print(`<span class="ok">linkedin</span> <a href="${PROFILE.links.linkedin}" target="_blank" rel="noopener">monis-raza</a>`);
        this.gap();
        this.print('<span class="dim">Available for full-time roles and freelance builds.</span>');
      },

      clear() { this.out.innerHTML = ""; this.banner(); },

      exit() { this.close(); },

      echo(args) { this.print(`<span class="dim">${esc(args.join(" "))}</span>`); }
    }
  };

  /* ---------- audio: a 20-line synth, opt-in ---------- */
  let AC;
  shell.sfx = false;
  shell.blip = function (freq = 620) {
    if (!this.sfx) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = "square";
      o.frequency.value = freq + Math.random() * 60;
      g.gain.setValueAtTime(0.03, AC.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 0.06);
      o.connect(g).connect(AC.destination);
      o.start(); o.stop(AC.currentTime + 0.07);
    } catch {}
  };

  /* ---------- root clearance badge ---------- */
  function rootBadge() {
    if ($("#root-badge")) return;
    const el = document.createElement("span");
    el.id = "root-badge";
    el.className = "chip root";
    el.innerHTML = '<i class="led"></i>clearance: <b>root</b>';
    $(".brand")?.after(el);
  }

  function restoreRoot() {
    try { if (localStorage.getItem("root") === "1") rootBadge(); } catch {}
  }

  /* ---------- theme ---------- */
  function applyTheme(name, pair) {
    const r = document.documentElement;
    r.style.setProperty("--acc", pair[0]);
    r.style.setProperty("--acc-2", pair[1]);
    r.style.setProperty("--glow", `0 0 22px ${pair[0]}55`);
    r.style.setProperty("--glow-soft", `0 0 40px ${pair[0]}22`);
    r.style.setProperty("--line", `${pair[0]}26`);
    r.style.setProperty("--line-strong", `${pair[0]}52`);
    r.dataset.theme = name;
  }

  function restoreTheme() {
    const THEMES = { green: ["#2bf5a4", "#35d6ff"], amber: ["#ffb454", "#ff8f40"], cyan: ["#35d6ff", "#7aa2ff"], crimson: ["#ff5470", "#ff9a8b"] };
    try {
      const t = localStorage.getItem("theme");
      if (t && THEMES[t]) applyTheme(t, THEMES[t]);
      shell.sfx = localStorage.getItem("sfx") === "1";
    } catch {}
  }

  function findProject(q) {
    if (!q) return null;
    const s = q.toLowerCase().trim();
    return PROJECTS.find((p) => p.id.toLowerCase() === s)
        || PROJECTS.find((p) => p.title.toLowerCase() === s)
        || PROJECTS.find((p) => p.id.toLowerCase().includes(s) || p.title.toLowerCase().includes(s));
  }

  /* ============================================================
     07. scroll reveal + nav state
     ============================================================ */
  let io;
  function observe() {
    if (REDUCED) { $$(".rise").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add("in"), Math.min(i * 55, 330));
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    $$(".rise:not(.in)").forEach((e) => io.observe(e));

    // safety net: nothing stays invisible, whatever the observer does
    clearTimeout(observe._t);
    observe._t = setTimeout(() => $$(".rise:not(.in)").forEach((e) => {
      if (e.getBoundingClientRect().top < innerHeight) e.classList.add("in");
    }), 2500);
  }

  function navState() {
    const nav = $(".nav");
    const links = $$(".nav-links a[href^='#']");
    const secs = links.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);

    const onScroll = () => {
      nav.classList.toggle("stuck", scrollY > 24);
      let cur = "";
      secs.forEach((s) => { if (s.getBoundingClientRect().top <= 140) cur = s.id; });
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     08. toast + contact form
     ============================================================ */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function contactForm() {
    const f = $("#contact-form");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(f);
      const subject = `[portfolio] ${d.get("name") || "hello"} — ${d.get("subject") || "new message"}`;
      const body = `${d.get("message") || ""}\n\n—\n${d.get("name") || ""}\n${d.get("email") || ""}`;
      location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast("opening your mail client …");
    });

    $$("[data-copy]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(b.dataset.copy).then(
          () => toast(`copied → ${b.dataset.copy}`),
          () => toast("copy blocked by browser")
        );
      });
    });
  }

  /* ============================================================
     09. wire up
     ============================================================ */
  function init() {
    restoreTheme();
    restoreRoot();
    renderStack();
    renderFilters();
    renderProjects();
    renderLog();
    observe();
    navState();
    contactForm();
    shell.init();
    rain();
    boot();

    // project cards → modal
    $("#grid").addEventListener("click", (e) => {
      const c = e.target.closest(".card");
      if (c) openProject(c.dataset.id);
    });
    $("#grid").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const c = e.target.closest(".card");
        if (c) { e.preventDefault(); openProject(c.dataset.id); }
      }
    });

    $("#more button").onclick = () => { shown += 9; renderProjects(); };

    // ---- probe bar: search, sort, live-only ----
    const q = $("#q");
    if (q) {
      let t;
      q.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => { state.q = q.value.trim(); shown = 9; renderProjects(); }, 110);
      });
      q.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { q.value = ""; state.q = ""; renderProjects(); q.blur(); }
        if (e.key === "Enter") {
          const first = $("#grid .card");
          if (first) { q.blur(); openProject(first.dataset.id); }
        }
      });
    }

    const sortBtn = $("#sort");
    if (sortBtn) {
      const order = Object.keys(SORTS);
      sortBtn.onclick = () => {
        state.sort = order[(order.indexOf(state.sort) + 1) % order.length];
        sortBtn.textContent = `sort: ${SORTS[state.sort].label}`;
        renderProjects();
      };
    }

    const liveBtn = $("#livetog");
    if (liveBtn) {
      liveBtn.onclick = () => {
        state.liveOnly = !state.liveOnly;
        liveBtn.dataset.on = state.liveOnly ? "1" : "0";
        shown = 9;
        renderProjects();
      };
    }

    // ---- j / k through the grid, enter to open ----
    const moveFocus = (dir) => {
      const cards = $$("#grid .card");
      if (!cards.length) return;
      const cur = cards.indexOf(document.activeElement);
      const next = cards[Math.max(0, Math.min(cards.length - 1, cur < 0 ? 0 : cur + dir))];
      cards.forEach((c) => c.classList.remove("kb"));
      next.classList.add("kb");
      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: "center", behavior: REDUCED ? "auto" : "smooth" });
    };

    // modal close
    $("#modal").addEventListener("mousedown", (e) => { if (e.target.id === "modal") closeModal(); });
    $("#modal-close").onclick = closeModal;

    // shell triggers
    $$("[data-shell]").forEach((b) => (b.onclick = () => shell.open()));

    // mobile nav
    const burger = $("#burger"), links = $("#nav-links");
    burger.onclick = () => links.classList.toggle("open");
    links.addEventListener("click", (e) => { if (e.target.tagName === "A") links.classList.remove("open"); });

    // global keys
    addEventListener("keydown", (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
      if (e.key === "Escape") { closeModal(); shell.close(); }
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); shell.toggle(); }
      if (e.key === "`" && !typing) { e.preventDefault(); shell.toggle(); }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        const box = $("#q");
        if (box) { box.scrollIntoView({ block: "center", behavior: REDUCED ? "auto" : "smooth" }); box.focus(); }
      }
      if ((e.key === "j" || e.key === "k") && !typing && !$("#shell").classList.contains("open")) {
        e.preventDefault();
        moveFocus(e.key === "j" ? 1 : -1);
      }
    });

    // konami — because of course
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let k = 0;
    addEventListener("keydown", (e) => {
      k = e.key === seq[k] ? k + 1 : 0;
      if (k === seq.length) { k = 0; shell.open(); shell.run("hack"); }
    });

    console.log("%c monis@portfolio ", "background:#2bf5a4;color:#04070a;font-weight:700;padding:3px 6px");
    console.log("%c you know your way around. press ` for the shell. ", "color:#7f93a2");
    console.log("%c there is a flag hidden on this box. start with: man flag ", "color:#ffb454");
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();

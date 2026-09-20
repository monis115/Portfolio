/* ============================================================
   case.js — case study page: architecture panel + API console
   ============================================================ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- architecture notes ---------- */
  const NODES = {
    angular: {
      path: "~/architecture/frontend",
      title: "Angular 21 · SSR + Service Worker",
      what: "Nine role-based dashboards built on Angular Material and RxJS, with route guards per role and an HTTP interceptor that attaches the auth token and handles 401s in one place. Chart.js drives the finance and admission dashboards.",
      why: "One framework, one component library, one state discipline across nine very different screens — consistency I could maintain alone. SSR gets meaningful content on screen before the bundle lands; the Service Worker makes it installable and usable on a weak connection.",
      cost: "SSR means the front end has a runtime, not just a CDN drop. Express has to be kept alive and its memory watched — the price of that first-byte render."
    },
    nginx: {
      path: "~/architecture/edge",
      title: "Nginx",
      what: "Terminates HTTPS and reverse-proxies to the application container, sitting in front of everything on the instance.",
      why: "A stable, boring edge. Certificates, redirects and request limits live in one config rather than inside application code.",
      cost: "One more moving part on the box, and a config that has to be kept in step with the deploy."
    },
    beanstalk: {
      path: "~/architecture/runtime",
      title: "AWS Elastic Beanstalk · Docker",
      what: "The Spring Boot service runs as a Docker container on Beanstalk, with Spring Actuator endpoints wired into the platform's health checks.",
      why: "I was the whole team. Beanstalk gave me rolling deploys, health checks and log access without me hand-rolling an orchestration story. Containerising meant the thing that ran on my machine was the thing that ran in production.",
      cost: "Less control than raw ECS or Kubernetes, and platform upgrades happen on AWS's schedule. Worth it for a single maintainer."
    },
    spring: {
      path: "~/architecture/service",
      title: "Spring Boot 3.5 — 35+ REST controllers",
      what: "A strict four-layer split: controller → service → repository → model, across four domains — admissions, finance, visas and documents. Java 21.",
      why: "The layering is what let a solo build stay navigable for six months. Controllers stay thin and do HTTP; services own the rules and the transactions; repositories own persistence. When something breaks, the layer tells you where to look.",
      cost: "More files and more mapping than a lean handler would need. The discipline earns its keep the moment a second person reads the code."
    },
    jpa: {
      path: "~/architecture/persistence",
      title: "Spring Data JPA · Hibernate",
      what: "Entity mapping, transaction boundaries at the service layer, and scheduled jobs for interest accrual on outstanding liabilities.",
      why: "Derived queries covered most of the surface, so the code that mattered was business logic rather than SQL plumbing. Accrual runs on a schedule so the figure is computed once and stored, not recalculated differently on every screen.",
      cost: "The usual ORM tax: you must watch what the mapping actually emits. Reporting queries got written explicitly rather than left to the mapper."
    },
    rds: {
      path: "~/architecture/data",
      title: "MySQL on AWS RDS",
      what: "The single source of truth for applications, users, finance records and document metadata.",
      why: "Managed backups, managed patching and point-in-time recovery mattered more than raw performance — this data is someone's university admission. Relational was never in question: the domain is joins.",
      cost: "Costs more than running MySQL on the same instance, and it's a network hop away. Both are cheap next to losing an applicant's record."
    },
    s3: {
      path: "~/architecture/storage",
      title: "AWS S3",
      what: "Every uploaded document — passports, offer letters, visa paperwork — with only the metadata kept in MySQL.",
      why: "Keeps the container disposable. Beanstalk can replace the instance at any moment and nothing is lost, which is exactly what you want from a deploy target.",
      cost: "Access control now lives in two places, and object permissions have to be as carefully reviewed as database ones."
    },
    mail: {
      path: "~/architecture/notify",
      title: "Spring Mail",
      what: "Transactional notifications as applications change state — submission, offer, visa decision, payment requests.",
      why: "Students and agents don't sit in the dashboard waiting. The email is the notification layer, and it ships with the framework rather than adding a vendor.",
      cost: "Deliverability is on you, and sending inside a request thread would block it — it belongs behind the scheduler and a queue."
    },
    reports: {
      path: "~/architecture/documents",
      title: "iText · Apache POI",
      what: "Server-side PDF generation for offer and finance documents, and Excel exports for the accounting team.",
      why: "Finance teams work in spreadsheets; universities want PDFs. Generating both server-side means one template, one source of numbers, and no browser inconsistencies in an official document.",
      cost: "Document generation is CPU-heavy and shares the application process. It's the first thing I'd pull into its own service."
    }
  };

  /* ---------- representative API surface ---------- */
  const ENDPOINTS = [
    {
      method: "GET", path: "/api/admissions?status=PENDING_REVIEW&page=0",
      role: "ADMISSION_MANAGER", domain: "admissions", ms: [70, 160],
      body: {
        page: 0, size: 20, totalElements: 47,
        content: [
          { id: 4471, student: "A. Khatun", university: "Bukhara State Medical Institute", intake: "2026-09", stage: "PENDING_REVIEW", agent: "AG-118", updatedAt: "2026-09-18T11:04:22Z" },
          { id: 4472, student: "R. Ahmed", university: "Qarshi State University", intake: "2026-09", stage: "PENDING_REVIEW", agent: "AG-204", updatedAt: "2026-09-18T09:51:10Z" }
        ]
      }
    },
    {
      method: "POST", path: "/api/admissions/4471/advance",
      role: "ADMISSION_MANAGER", domain: "admissions", ms: [120, 260],
      request: { toStage: "OFFER_ISSUED", note: "Documents verified against university checklist" },
      body: {
        id: 4471, stage: "OFFER_ISSUED", previousStage: "PENDING_REVIEW",
        offerLetter: { documentId: "DOC-90231", generated: true, storage: "s3://campusconnect-docs/offers/4471.pdf" },
        notification: { channel: "EMAIL", queued: true }
      }
    },
    {
      method: "GET", path: "/api/finance/agents/AG-118/ledger",
      role: "ACCOUNTANT", domain: "finance", ms: [90, 200],
      body: {
        agent: "AG-118", creditLimit: 500000, creditUsed: 312500, currency: "INR",
        liabilities: [
          { ref: "LIA-7741", principal: 150000, accruedInterest: 4375, accruedThrough: "2026-09-19", rate: "1.75%/mo" },
          { ref: "LIA-7788", principal: 162500, accruedInterest: 1896, accruedThrough: "2026-09-19", rate: "1.75%/mo" }
        ],
        note: "Interest posted nightly by the accrual job, never computed at read time."
      }
    },
    {
      method: "POST", path: "/api/finance/collection-requests",
      role: "ACCOUNTANT", domain: "finance", ms: [140, 300],
      request: { agentId: "AG-204", amount: 75000, currency: "INR", dueDate: "2026-10-05", reason: "Tuition instalment 2 of 4" },
      body: { id: "COL-3391", status: "SENT", amount: 75000, dueDate: "2026-10-05", notifiedAt: "2026-09-20T06:12:04Z" }
    },
    {
      method: "GET", path: "/api/visas/queue?stage=INTERVIEW_SCHEDULED",
      role: "VISA_MANAGER", domain: "visas", ms: [80, 170],
      body: {
        totalElements: 12,
        content: [
          { applicationId: 4468, student: "S. Rahman", embassy: "Tashkent", slot: "2026-10-02T09:30:00Z", checklist: { passport: "OK", offer: "OK", finance: "PENDING" } },
          { applicationId: 4470, student: "M. Iqbal", embassy: "Bishkek", slot: "2026-10-03T13:00:00Z", checklist: { passport: "OK", offer: "OK", finance: "OK" } }
        ]
      }
    },
    {
      method: "POST", path: "/api/documents/upload",
      role: "DOC_PERSON", domain: "documents", ms: [220, 460],
      request: { applicationId: 4471, type: "PASSPORT", filename: "passport.pdf", contentType: "application/pdf" },
      body: {
        documentId: "DOC-90244", type: "PASSPORT", storage: "s3://campusconnect-docs/4471/passport.pdf",
        checksum: "sha256:9f2c…a41e", scanned: true, sizeBytes: 842114, uploadedBy: "USR-77"
      }
    },
    {
      method: "GET", path: "/api/admissions/4471",
      role: "STUDENT", domain: "admissions", ms: [60, 130],
      note: "Same resource, student token — the response is deliberately thinner.",
      body: {
        id: 4471, stage: "OFFER_ISSUED", university: "Bukhara State Medical Institute", intake: "2026-09",
        nextAction: "Upload your visa photograph",
        documents: [{ type: "OFFER_LETTER", available: true }],
        finance: "hidden for role STUDENT"
      }
    },
    {
      method: "GET", path: "/actuator/health",
      role: "SYSTEM", domain: "ops", ms: [20, 60],
      body: { status: "UP", components: { db: { status: "UP", details: { database: "MySQL" } }, diskSpace: { status: "UP" }, mail: { status: "UP" }, ping: { status: "UP" } } }
    }
  ];

  /* ---------- architecture interaction ---------- */
  function architecture() {
    const svg = $("#arch-svg"), body = $("#arch-body"), path = $("#arch-path");
    if (!svg) return;

    const show = (key) => {
      const n = NODES[key];
      if (!n) return;
      $$(".node", svg).forEach((g) => g.classList.toggle("on", g.dataset.node === key));
      path.textContent = n.path;
      body.innerHTML = `
        <h3>${n.title}</h3>
        <div class="ab"><span class="lb">what it does</span><p>${n.what}</p></div>
        <div class="ab"><span class="lb ok">why this</span><p>${n.why}</p></div>
        <div class="ab"><span class="lb warn">what it costs</span><p>${n.cost}</p></div>`;
    };

    $$(".node", svg).forEach((g) => {
      g.addEventListener("click", () => show(g.dataset.node));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(g.dataset.node); } });
    });

    show("spring");
  }

  /* ---------- API console ---------- */
  function api() {
    const list = $("#api-list"), out = $("#api-body"), path = $("#api-path"), status = $("#api-status");
    if (!list) return;

    list.innerHTML = ENDPOINTS.map((e, i) => `
      <button class="api-item" data-i="${i}">
        <span class="m m-${e.method.toLowerCase()}">${e.method}</span>
        <span class="p">${e.path.split("?")[0]}</span>
        <span class="r">${e.role}</span>
      </button>`).join("");

    let busy = false;

    const fire = async (i) => {
      if (busy) return;
      const e = ENDPOINTS[i];
      busy = true;

      $$(".api-item", list).forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
      path.textContent = e.path;
      status.className = "api-status running";
      status.textContent = "…";

      const lines = [`> ${e.method} ${e.path}`, `> authorization: Bearer <${e.role.toLowerCase()}-token>`];
      if (e.request) lines.push(`> content-type: application/json`, ``, JSON.stringify(e.request, null, 2));
      out.textContent = lines.join("\n") + "\n\nwaiting…";

      const ms = e.ms[0] + Math.random() * (e.ms[1] - e.ms[0]);
      await new Promise((r) => setTimeout(r, REDUCED ? 0 : ms));

      const code = e.method === "POST" ? 201 : 200;
      status.className = "api-status ok";
      status.textContent = `${code} · ${Math.round(ms)}ms`;

      out.textContent =
        lines.join("\n") +
        `\n\n< HTTP/1.1 ${code} ${code === 201 ? "Created" : "OK"}` +
        `\n< content-type: application/json` +
        `\n< x-role-gate: ${e.role}` +
        `\n< time: ${Math.round(ms)}ms\n\n` +
        JSON.stringify(e.body, null, 2) +
        (e.note ? `\n\n// ${e.note}` : "");

      busy = false;
    };

    list.addEventListener("click", (ev) => {
      const b = ev.target.closest(".api-item");
      if (b) fire(+b.dataset.i);
    });
  }

  /* ---------- reticle (shared look with the main page) ---------- */
  function reticle() {
    const el = $("#reticle");
    if (!el || !FINE || REDUCED) return;
    const ring = $(".ring", el), dot = $(".dot", el), xy = $(".xy", el);
    const hairH = $(".hair.h", el), hairV = $(".hair.v", el);
    let tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty;

    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      const hot = e.target.closest?.("a, button, .node, .api-item");
      el.classList.toggle("hot", !!hot);
      xy.textContent = hot
        ? (e.target.closest(".node") ? "INSPECT" : e.target.closest(".api-item") ? "SEND" : "GOTO")
        : `${String(Math.round(tx)).padStart(4, "0")}:${String(Math.round(ty)).padStart(4, "0")}`;
    }, { passive: true });

    const loop = () => {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      dot.style.transform = `translate(${tx}px, ${ty}px)`;
      xy.style.transform = `translate(${tx + 16}px, ${ty + 14}px)`;
      hairH.style.transform = `translateY(${ty}px)`;
      hairV.style.transform = `translateX(${tx}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function init() { architecture(); api(); reticle(); }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();

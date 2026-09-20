/* ============================================================
   engine.js — CampusConnect admission pipeline, playable

   A working model of the platform I built for Rare Education:
   a role gate in front of a workflow state machine, with the
   side effects that hang off each transition — offer letters,
   S3 uploads, mail, ledger entries, accrual.

   Same rules as the real service, rewritten standalone for this
   page. No client data, no live system, nothing fabricated about
   what it does.
   ============================================================ */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pad = (s, n) => String(s) + ".".repeat(Math.max(0, n - String(s).length));
  const money = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  /* ---------- the workflow ---------- */
  const STAGES = ["ENQUIRY", "DOCS_PENDING", "UNDER_REVIEW", "OFFER_ISSUED", "FEE_PENDING", "VISA_FILED", "ENROLLED"];

  /* ---------- who may do what ---------- */
  const GATE = {
    ADMIN:             ["view", "advance", "upload", "collect", "release", "visa", "export"],
    ADMISSION_MANAGER: ["view", "advance", "upload", "export"],
    AGENT:             ["view", "upload"],
    ACCOUNTANT:        ["view", "collect", "release", "export"],
    VISA_MANAGER:      ["view", "visa"],
    DOC_PERSON:        ["view", "upload"],
    STUDENT:           ["view", "upload"]
  };

  const ACTION_LABEL = {
    view: "GET  /api/admissions/{id}",
    advance: "POST /api/admissions/{id}/advance",
    upload: "POST /api/documents/upload",
    collect: "POST /api/finance/collection-requests",
    release: "POST /api/finance/fund-release",
    visa: "POST /api/visas/{id}/schedule",
    export: "GET  /api/reports/admissions.xlsx"
  };

  let running = false;

  /* ---------- request planner ---------- */
  function plan(cfg) {
    const steps = [];
    const id = 4471;
    const stageIndex = STAGES.indexOf(cfg.stage);
    const next = STAGES[Math.min(stageIndex + 1, STAGES.length - 1)];
    const route = ACTION_LABEL[cfg.action].replace("{id}", id);

    steps.push(["ink", route]);
    steps.push(["dim", `${pad("authorization", 20)} Bearer <${cfg.role.toLowerCase()}-token>`]);
    steps.push(["dim", `${pad("application", 20)} #${id} · stage ${cfg.stage}`]);

    /* ---- the corner nobody reaches on purpose ---- */
    if (cfg.role === "STUDENT" && cfg.action === "release") {
      steps.push(["err", `${pad("role gate", 20)} DENIED`]);
      steps.push(["dim", `${pad("", 20)} STUDENT asked the platform to release funds to itself.`]);
      steps.push(["sp", ""]);
      steps.push(["res-err", `✗ 403 Forbidden — nice try`]);
      steps.push(["sp", ""]);
      steps.push(["acc", `// somebody had to test this. thank you for your service.`]);
      steps.push(["ok",  `// fragment 3/3 :: _g4t3}`]);
      steps.push(["dim", `// join all three and run 'flag <it>' in the shell.`]);
      return { steps, verdict: "denied" };
    }

    /* ---- 1. the role gate, server-side ---- */
    const allowed = GATE[cfg.role].includes(cfg.action);
    if (!allowed) {
      steps.push(["err", `${pad("role gate", 20)} DENIED — ${cfg.role} may not ${cfg.action}`]);
      steps.push(["dim", `${pad("", 20)} the dashboard hides it; the API refuses it. Both matter.`]);
      steps.push(["sp", ""]);
      steps.push(["res-err", `✗ 403 Forbidden`]);
      return { steps, verdict: "denied" };
    }
    steps.push(["ok", `${pad("role gate", 20)} PASS — ${cfg.role}`]);

    /* ---- 2. preconditions ---- */
    if (cfg.action === "advance") {
      const needsDocs = ["DOCS_PENDING", "UNDER_REVIEW"].includes(cfg.stage);
      const needsFee  = cfg.stage === "FEE_PENDING";

      steps.push(["dim", `${pad("transition", 20)} ${cfg.stage} → ${next}`]);

      if (needsDocs && !cfg.docs) {
        steps.push(["err", `${pad("precondition", 20)} documents incomplete`]);
        steps.push(["dim", `${pad("", 20)} passport ✓ · transcripts ✗ · photograph ✗`]);
        steps.push(["sp", ""]);
        steps.push(["res-warn", `✗ 409 Conflict — the file is not ready to move`]);
        return { steps, verdict: "blocked" };
      }
      if (needsFee && !cfg.fees) {
        steps.push(["err", `${pad("precondition", 20)} instalment 1 unpaid`]);
        steps.push(["sp", ""]);
        steps.push(["res-warn", `✗ 409 Conflict — finance has not cleared this applicant`]);
        return { steps, verdict: "blocked" };
      }
      if (cfg.stage === "VISA_FILED" && !cfg.visa) {
        steps.push(["err", `${pad("precondition", 20)} visa checklist incomplete`]);
        steps.push(["sp", ""]);
        steps.push(["res-warn", `✗ 409 Conflict — embassy pack not signed off`]);
        return { steps, verdict: "blocked" };
      }
      steps.push(["ok", `${pad("preconditions", 20)} satisfied`]);
    }

    /* ---- 3. side effects: the part that makes it a platform ---- */
    const body = { applicationId: id, actor: cfg.role };

    if (cfg.action === "advance") {
      body.stage = next;
      body.previousStage = cfg.stage;

      if (next === "OFFER_ISSUED") {
        const doc = "DOC-" + rnd(90000, 99999);
        steps.push(["dim", `${pad("offer letter", 20)} iText → ${doc}.pdf`]);
        steps.push(["dim", `${pad("object store", 20)} s3://campusconnect-docs/offers/${id}.pdf`]);
        body.offerLetter = { documentId: doc, storage: `s3://campusconnect-docs/offers/${id}.pdf` };
      }
      if (next === "FEE_PENDING") {
        steps.push(["dim", `${pad("ledger", 20)} liability opened against agent AG-118`]);
        body.ledger = { ref: "LIA-" + rnd(7000, 7999), principal: 150000, currency: "INR" };
      }
      steps.push(["dim", `${pad("notification", 20)} Spring Mail queued → student + agent`]);
      body.notification = { channel: "EMAIL", queued: true };
    }

    if (cfg.action === "upload") {
      const doc = "DOC-" + rnd(90000, 99999);
      steps.push(["dim", `${pad("multipart", 20)} passport.pdf · 842 KB`]);
      steps.push(["dim", `${pad("object store", 20)} s3://campusconnect-docs/${id}/passport.pdf`]);
      steps.push(["dim", `${pad("metadata", 20)} MySQL row only — bytes never touch the container`]);
      Object.assign(body, { documentId: doc, type: "PASSPORT", scanned: true });
    }

    if (cfg.action === "collect") {
      const amount = rnd(2, 8) * 25000;
      steps.push(["dim", `${pad("collection", 20)} ₹${money(amount)} requested from AG-118`]);
      steps.push(["dim", `${pad("due", 20)} T+15 · reminder scheduled`]);
      Object.assign(body, { id: "COL-" + rnd(3000, 3999), amount, currency: "INR", status: "SENT" });
    }

    if (cfg.action === "release") {
      const amount = rnd(2, 6) * 25000;
      steps.push(["dim", `${pad("fund release", 20)} ₹${money(amount)} → university account`]);
      steps.push(["dim", `${pad("accrual", 20)} nightly job recalculates outstanding interest`]);
      steps.push(["dim", `${pad("", 20)} computed once and stored — every dashboard agrees`]);
      Object.assign(body, { id: "REL-" + rnd(500, 999), amount, currency: "INR", accrualJob: "SCHEDULED" });
    }

    if (cfg.action === "visa") {
      steps.push(["dim", `${pad("embassy slot", 20)} Tashkent · T+12 09:30`]);
      steps.push(["dim", `${pad("checklist", 20)} passport ✓ · offer ✓ · finance ${cfg.fees ? "✓" : "PENDING"}`]);
      Object.assign(body, { interview: { embassy: "Tashkent", slot: "T+12 09:30" } });
    }

    if (cfg.action === "export") {
      steps.push(["dim", `${pad("apache poi", 20)} admissions.xlsx · 6 sheets`]);
      steps.push(["dim", `${pad("scope", 20)} rows filtered to what ${cfg.role} may see`]);
      Object.assign(body, { file: "admissions.xlsx", rows: rnd(180, 640), sheets: 6 });
    }

    if (cfg.action === "view") {
      steps.push(["dim", `${pad("projection", 20)} response shaped for ${cfg.role}`]);
      if (cfg.role === "STUDENT") {
        steps.push(["warn", `${pad("", 20)} finance and agent fields stripped from the payload`]);
        Object.assign(body, {
          stage: cfg.stage, university: "Bukhara State Medical Institute",
          nextAction: "Upload your visa photograph", finance: "hidden for role STUDENT"
        });
      } else {
        Object.assign(body, {
          stage: cfg.stage, university: "Bukhara State Medical Institute",
          agent: "AG-118", feesCleared: cfg.fees, documentsComplete: cfg.docs
        });
      }
    }

    steps.push(["dim", `${pad("audit", 20)} actor · timestamp · previous value`]);
    steps.push(["json", JSON.stringify(body, null, 2)]);
    steps.push(["sp", ""]);

    const created = ["advance", "upload", "collect", "release", "visa"].includes(cfg.action);
    steps.push(["res-ok", `✓ ${created ? "201 Created" : "200 OK"} — ${cfg.action} accepted for ${cfg.role}`]);
    return { steps, verdict: "ok" };
  }

  /* ---------- wiring ---------- */
  function read() {
    return {
      role: $("#e-role").value,
      stage: $("#e-stage").value,
      action: $("#e-action").value,
      docs: $("#e-docs").dataset.on === "1",
      fees: $("#e-fees").dataset.on === "1",
      visa: $("#e-visa").dataset.on === "1"
    };
  }

  function run() {
    if (running) return;
    const out = $("#e-out"), badge = $("#e-verdict");
    const { steps, verdict } = plan(read());

    running = true;
    out.innerHTML = "";
    badge.className = "e-verdict running";
    badge.textContent = "…";
    $("#e-run").disabled = true;

    let i = 0;
    const t0 = performance.now();
    const emit = () => {
      if (i >= steps.length) {
        running = false;
        $("#e-run").disabled = false;
        badge.className = "e-verdict " + verdict;
        badge.textContent = { ok: "200 · 201", denied: "403", blocked: "409" }[verdict];
        return;
      }
      const [kind, text] = steps[i++];
      const ms = ((performance.now() - t0) / 1000).toFixed(2).padStart(5, "0");

      if (kind === "sp") out.insertAdjacentHTML("beforeend", '<div class="e-sp"></div>');
      else if (kind === "json") out.insertAdjacentHTML("beforeend", `<pre class="e-json">${text}</pre>`);
      else out.insertAdjacentHTML("beforeend", `<div class="e-ln ${kind}"><span class="e-t">[${ms}]</span>${text}</div>`);

      out.scrollTop = out.scrollHeight;
      setTimeout(emit, REDUCED ? 0 : (kind.startsWith("res") ? 200 : 55 + Math.random() * 70));
    };
    emit();
  }

  function randomise() {
    const pick = (sel) => { const o = $(sel).options; $(sel).selectedIndex = rnd(0, o.length - 1); };
    pick("#e-role"); pick("#e-stage"); pick("#e-action");
    $$(".e-toggle").forEach((b) => { b.dataset.on = Math.random() > 0.4 ? "1" : "0"; sync(b); });
    sync();
  }

  function sync(btn) {
    if (btn) btn.querySelector(".e-state").textContent = btn.dataset.on === "1" ? btn.dataset.yes : btn.dataset.no;

    const role = $("#e-role").value, action = $("#e-action").value;
    const allowed = GATE[role].includes(action);
    const hint = $("#e-hint");

    if (!allowed) {
      hint.innerHTML = `<b>${role}</b> has no right to <b>${action}</b> — the API will refuse it before the workflow is even consulted.`;
    } else if (action === "advance") {
      hint.innerHTML = `<b>${role}</b> may advance the file. Whether it <i>moves</i> depends on the preconditions below.`;
    } else if (action === "view" && role === "STUDENT") {
      hint.innerHTML = `Same endpoint, student token — the response comes back deliberately thinner.`;
    } else {
      hint.innerHTML = `<b>${role}</b> may ${action}. Watch what the transition drags along with it.`;
    }
  }

  function init() {
    if (!$("#engine")) return;

    $("#e-run").onclick = run;
    $("#e-rnd").onclick = () => { randomise(); run(); };

    $$(".e-toggle").forEach((b) => {
      sync(b);
      b.onclick = () => { b.dataset.on = b.dataset.on === "1" ? "0" : "1"; sync(b); };
    });

    $$("#engine select").forEach((el) => el.addEventListener("change", () => sync()));
    sync();

    new IntersectionObserver((en, obs) => {
      if (en[0].isIntersecting) { run(); obs.disconnect(); }
    }, { threshold: 0.35 }).observe($("#engine"));
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();

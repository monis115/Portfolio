/* ============================================================
   data.js — single source of truth for the portfolio payload
   Every record below maps to a real repository on github.com/monis115
   ============================================================ */

const PROFILE = {
  handle: "monis115",
  name: "Monis Raza",
  fullName: "Md Monis Raza",
  role: "Full Stack Developer",
  focus: "Java / Spring Boot & Angular",
  title: "Java Backend Developer — Tata Consultancy Services",
  company: "Tata Consultancy Services",
  venture: "Zorix Lab",
  location: "New Delhi, India",
  email: "monisraza2009@gmail.com",
  phone: "+91-9540194616",
  since: "2022-01-23",
  links: {
    github: "https://github.com/monis115",
    linkedin: "https://www.linkedin.com/in/monis-raza-0552b715a/",
    instagram: "https://www.instagram.com/monis___raza___/?hl=en",
    zorix: "https://www.zorixlab.com/",
    // the PDF carries client-confidential detail, so it is not hosted publicly.
    // `cat resume.txt` in the shell prints the shareable version.
    resume: null
  }
};

const CATEGORIES = [
  { id: "all",      label: "all",       glyph: "*" },
  { id: "platform", label: "platforms", glyph: "◈" },
  { id: "backend",  label: "backend",   glyph: "⌘" },
  { id: "site",     label: "product",   glyph: "▣" },
  { id: "app",      label: "apps",      glyph: "▸" },
  { id: "lab",      label: "lab",       glyph: "⚑" }
];

const PROJECTS = [
  {
    id: "CampusConnect",
    title: "CampusConnect",
    tagline: "Multi-role admission management platform",
    desc: "Built solo, end to end, for Rare Education Private Limited: an Angular 21 front end over a Spring Boot 3.5 REST API, shipped as one admission-management product. Nine role-based dashboards (admin, admission manager, agent, accountant, telex, university, visa, documents, student) with Angular Material, RxJS, route guards and an HTTP auth interceptor. Backend runs a four-layer architecture — controller → service → repository → model — on Spring Data JPA/Hibernate over MySQL on AWS RDS, with 35+ REST controllers across admissions, finance, visas and documents. S3 document storage, iText PDF generation, Apache POI Excel exports, Spring Mail notifications, and scheduled jobs driving interest accrual across the financial workflows. Ships as an installable offline-capable PWA via Angular Service Worker + SSR, containerised with Docker and deployed to AWS Elastic Beanstalk behind Nginx with HTTPS and Actuator health checks.",
    stack: ["Angular 21", "TypeScript", "Java 21", "Spring Boot 3.5", "MySQL", "AWS", "Docker"],
    cat: "platform",
    year: 2025,
    weight: 0,
    src: null,
    live: null,
    caseStudy: "case/campusconnect.html",
    metrics: [["role", "solo build"], ["dashboards", "9"], ["controllers", "35+"], ["cloud", "AWS RDS · S3 · Beanstalk"], ["delivery", "PWA + SSR"], ["status", "client deploy"]]
  },
  {
    id: "MedCore",
    title: "MedCore",
    tagline: "Hospital billing system — Grace Hospital",
    desc: "Billing backend for Grace Hospital: REST APIs covering patient, doctor and billing management, automated PDF invoice generation, and an H2 in-memory database behind Spring Data JPA.",
    stack: ["Java 17", "Spring Boot", "Spring Data JPA", "H2", "REST APIs"],
    cat: "backend",
    year: 2026,
    weight: 0.7,
    src: null,
    live: null,
    metrics: [["sector", "healthcare"], ["delivered", "Jan–Mar 2026"], ["output", "automated invoicing"]]
  },
  {
    id: "SinaiEduCon",
    title: "Sinai EduCon",
    tagline: "Study-abroad admissions platform",
    desc: "The heaviest build in the arsenal — a study-abroad consultancy platform carrying 20+ dedicated university microsites, a destinations index, college directory, an admin console and a PWA manifest. Routing hardened with .htaccess, content structured for search.",
    stack: ["HTML5", "JavaScript", "PWA", "SEO", "Apache"],
    cat: "platform",
    year: 2026,
    weight: 1,
    src: "https://github.com/monis115/SinaiEduCon",
    live: null,
    metrics: [["pages", "40+"], ["payload", "105 MB"], ["status", "private deploy"]]
  },
  {
    id: "ZorixLab",
    title: "Zorix Lab",
    tagline: "Studio site + hiring pipeline",
    desc: "Company site for my own software studio. Multi-track careers funnel (developer / web / software / video), CRM and app product pages, story, blog and privacy stack — the whole front of house for Zorix Lab.",
    stack: ["HTML5", "CSS3", "JavaScript", "Apache"],
    cat: "platform",
    year: 2026,
    weight: 2,
    src: "https://github.com/monis115/ZorixLab",
    live: "https://www.zorixlab.com/",
    metrics: [["routes", "18"], ["funnels", "4"], ["status", "live"]]
  },
  {
    id: "MyCampusBackend",
    title: "MyCampus API",
    tagline: "Spring Boot campus backend",
    desc: "Java service layer for a campus application — Maven build, Dockerfile for container deploys, upload handling and a conventional Spring Boot source tree. The server-side counterweight to the front-end work.",
    stack: ["Java", "Spring Boot", "Maven", "Docker"],
    cat: "backend",
    year: 2026,
    weight: 3,
    src: "https://github.com/monis115/MyCampusBackend",
    live: null,
    metrics: [["language", "Java"], ["container", "Docker"], ["build", "Maven"]]
  },
  {
    id: "carshare",
    title: "CarShare",
    tagline: "Carpooling / ride-matching platform",
    desc: "Full-stack carpooling system: drivers post seats, riders join a route, costs get split. Built on PHP with a relational backend — user flows, ride records and matching logic wired end to end.",
    stack: ["PHP", "MySQL", "Bootstrap", "jQuery"],
    cat: "platform",
    year: 2023,
    weight: 4,
    src: "https://github.com/monis115/carshare",
    live: "https://monis115.github.io/carshare/",
    metrics: [["architecture", "LAMP"], ["type", "full-stack"], ["domain", "mobility"]]
  },
  {
    id: "noteApp",
    title: "NoteApp",
    tagline: "Online note-taking workspace",
    desc: "An all-in-one digital notepad for students and professionals — create, organise and retrieve notes from the browser. PHP backend, persistent storage, built to be the one tab you keep open.",
    stack: ["PHP", "MySQL", "CSS3", "JavaScript"],
    cat: "platform",
    year: 2023,
    weight: 5,
    src: "https://github.com/monis115/noteApp",
    live: "https://monis115.github.io/noteApp/",
    metrics: [["architecture", "LAMP"], ["type", "CRUD"], ["auth", "yes"]]
  },
  {
    id: "IMC",
    title: "IMC Educational Consultancy",
    tagline: "Admissions & counselling portal",
    desc: "Production site for an education consultancy: course catalogues, country guides, enquiry capture and a deep media library. Shipped and serving real applicants.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2026,
    weight: 6,
    src: "https://github.com/monis115/IMC",
    live: "https://monis115.github.io/IMC/",
    metrics: [["assets", "175 MB"], ["status", "live"], ["sector", "edtech"]]
  },
  {
    id: "gazal",
    title: "Shab-e-Ghazal",
    tagline: "Urdu ghazal radio, in the browser",
    desc: "A mehfil that runs in a tab — a curated streaming room for Urdu ghazals from Jagjit Singh, Mehdi Hassan and company. Custom player, typographic mood, zero framework.",
    stack: ["HTML5", "CSS3", "JavaScript", "Audio API"],
    cat: "app",
    year: 2026,
    weight: 7,
    src: "https://github.com/monis115/gazal",
    live: "https://monis115.github.io/gazal/",
    metrics: [["type", "web player"], ["deps", "none"], ["status", "live"]]
  },
  {
    id: "MchaT",
    title: "MchaT",
    tagline: "Custom GPT chat interface",
    desc: "A hand-rolled conversational UI — message threading, streaming-style rendering and a chat shell built from scratch rather than lifted from a template.",
    stack: ["HTML5", "JavaScript", "LLM API"],
    cat: "app",
    year: 2025,
    weight: 8,
    src: "https://github.com/monis115/MchaT",
    live: "https://monis115.github.io/MchaT/",
    metrics: [["type", "chat UI"], ["mode", "streaming"], ["status", "live"]]
  },
  {
    id: "instagramClone",
    title: "Instagram Clone",
    tagline: "React feed reconstruction",
    desc: "Instagram's core loop rebuilt in React — component-driven feed, stories rail, post interactions and state handled the way a production app would handle it.",
    stack: ["React", "JavaScript", "CSS3"],
    cat: "app",
    year: 2023,
    weight: 9,
    src: "https://github.com/monis115/instagramClone",
    live: "https://monis115.github.io/instagramClone/",
    metrics: [["framework", "React"], ["type", "SPA"], ["status", "live"]]
  },
  {
    id: "BikeEngine",
    title: "BikeEngine",
    tagline: "Scroll-driven product showcase",
    desc: "A scrollytelling build where the engine assembles itself as you move down the page — frame sequencing, pinned sections and motion tuned to the scrollbar.",
    stack: ["JavaScript", "CSS3", "GSAP-style motion"],
    cat: "site",
    year: 2026,
    weight: 10,
    src: "https://github.com/monis115/BikeEngine",
    live: "https://monis115.github.io/BikeEngine/",
    metrics: [["technique", "scroll-sync"], ["assets", "35 MB"], ["status", "live"]]
  },
  {
    id: "WardrobeJamia",
    title: "WardrobeJamia",
    tagline: "Fashion storefront",
    desc: "Premium fashion e-commerce front end — catalogue grid, product detail views, cart interactions and a brand identity that holds together on mobile.",
    stack: ["JavaScript", "CSS3", "HTML5"],
    cat: "site",
    year: 2026,
    weight: 11,
    src: "https://github.com/monis115/WardrobeJamia",
    live: "https://monis115.github.io/WardrobeJamia/",
    metrics: [["sector", "retail"], ["type", "storefront"], ["status", "live"]]
  },
  {
    id: "MazaarRest",
    title: "Mazaar Restaurant",
    tagline: "Afghan restaurant & cafe",
    desc: "Restaurant site built around the menu — dish photography, reservation call-to-actions and a warm identity that still loads fast.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2026,
    weight: 12,
    src: "https://github.com/monis115/MazaarRest",
    live: "https://monis115.github.io/MazaarRest/",
    metrics: [["sector", "F&B"], ["type", "brand site"], ["status", "live"]]
  },
  {
    id: "TheAbroadMBBS",
    title: "The Abroad MBBS",
    tagline: "Overseas medical admissions",
    desc: "Lead-generation site for overseas MBBS admissions — university comparisons, eligibility explainers and enquiry funnels.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2024,
    weight: 13,
    src: "https://github.com/monis115/TheAbroadMBBS",
    live: "https://monis115.github.io/TheAbroadMBBS/",
    metrics: [["sector", "edtech"], ["type", "lead-gen"], ["status", "live"]]
  },
  {
    id: "KarshiStateUniversity",
    title: "Qarshi State University",
    tagline: "University web presence",
    desc: "Full institutional site for Qarshi State University — faculties, admissions, campus life and international student pathways.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2025,
    weight: 14,
    src: "https://github.com/monis115/KarshiStateUniversity",
    live: "https://monis115.github.io/KarshiStateUniversity/",
    metrics: [["assets", "20 MB"], ["sector", "education"], ["status", "live"]]
  },
  {
    id: "Karshi",
    title: "Karshi — Variant",
    tagline: "Alternate university build",
    desc: "Parallel design direction for the Qarshi university project, kept as a separate branch of thinking rather than overwriting the shipped one.",
    stack: ["HTML5", "CSS3"],
    cat: "lab",
    year: 2025,
    weight: 22,
    src: "https://github.com/monis115/Karshi",
    live: null,
    metrics: [["type", "variant"], ["status", "archived"]]
  },
  {
    id: "espressoFine",
    title: "Espresso Fino — ABQ",
    tagline: "Specialty coffee bar",
    desc: "Albuquerque espresso bar — menu-first layout, location and hours front and centre, built for a phone held in one hand.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2026,
    weight: 15,
    src: "https://github.com/monis115/espressoFine",
    live: "https://monis115.github.io/espressoFine/",
    metrics: [["sector", "F&B"], ["status", "live"]]
  },
  {
    id: "YawFarmCoffeeRoaster",
    title: "Yaw Farm Coffee Roaster",
    tagline: "Farm-to-cup roastery",
    desc: "\"The art of the bean\" — a roastery brand site built around origin storytelling, roast profiles and wholesale enquiries.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2026,
    weight: 16,
    src: "https://github.com/monis115/YawFarmCoffeeRoaster",
    live: "https://monis115.github.io/YawFarmCoffeeRoaster/",
    metrics: [["sector", "F&B"], ["status", "live"]]
  },
  {
    id: "GoldenSteamer",
    title: "Golden Steamer",
    tagline: "Bao house, NYC",
    desc: "\"The art of the bun\" — a tight, fast, single-page identity for a steamed-bun kitchen. Minimal payload, maximum appetite.",
    stack: ["HTML5", "CSS3"],
    cat: "site",
    year: 2026,
    weight: 17,
    src: "https://github.com/monis115/GoldenSteamer",
    live: "https://monis115.github.io/GoldenSteamer/",
    metrics: [["payload", "6 KB"], ["status", "live"]]
  },
  {
    id: "LaBonbonniere",
    title: "La Bonbonniere",
    tagline: "NYC diner since 1930",
    desc: "Heritage diner site — period-correct typography, menu board and the kind of restraint a ninety-year-old institution earns.",
    stack: ["HTML5", "CSS3"],
    cat: "site",
    year: 2026,
    weight: 18,
    src: "https://github.com/monis115/LaBonbonniere",
    live: "https://monis115.github.io/LaBonbonniere/",
    metrics: [["payload", "7 KB"], ["status", "live"]]
  },
  {
    id: "LucidCafe",
    title: "Lucid Cafe",
    tagline: "Midtown classic-modern coffee",
    desc: "Midtown coffee bar with a clean editorial grid — photography-led hero, menu, and hours without a single unnecessary kilobyte of script.",
    stack: ["HTML5", "CSS3"],
    cat: "site",
    year: 2026,
    weight: 19,
    src: "https://github.com/monis115/LucidCafe",
    live: "https://monis115.github.io/LucidCafe/",
    metrics: [["sector", "F&B"], ["status", "live"]]
  },
  {
    id: "DruryCoventGarden",
    title: "Drury 188—189",
    tagline: "Covent Garden cafe — current build",
    desc: "Rebuild of the Drury 188-189 cafe site in Covent Garden, London — refreshed layout and asset pipeline over the legacy version.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "site",
    year: 2026,
    weight: 20,
    src: "https://github.com/monis115/DruryCoventGarden",
    live: null,
    metrics: [["city", "London"], ["status", "staged"]]
  },
  {
    id: "DruryCoventGarden_Legacy",
    title: "Drury 188—189 — Legacy",
    tagline: "The shipped original",
    desc: "The original Covent Garden build, still deployed — kept intact as a reference point against the rebuild.",
    stack: ["HTML5", "CSS3"],
    cat: "site",
    year: 2026,
    weight: 21,
    src: "https://github.com/monis115/DruryCoventGarden_Legacy",
    live: "https://monis115.github.io/DruryCoventGarden_Legacy/",
    metrics: [["city", "London"], ["status", "live"]]
  },
  {
    id: "FruitGamee",
    title: "Fruits Game",
    tagline: "Browser arcade",
    desc: "A small, mean little browser game — DOM-driven animation, scoring loop and hit detection written without a game engine.",
    stack: ["JavaScript", "CSS3", "HTML5"],
    cat: "app",
    year: 2024,
    weight: 23,
    src: "https://github.com/monis115/FruitGamee",
    live: "https://monis115.github.io/FruitGamee/",
    metrics: [["type", "game"], ["engine", "none"], ["status", "live"]]
  },
  {
    id: "nxtWave",
    title: "nxtWave",
    tagline: "React component assignment",
    desc: "React build submitted for the NxtWave track — component composition, props/state discipline and routing.",
    stack: ["React", "JavaScript"],
    cat: "app",
    year: 2023,
    weight: 24,
    src: "https://github.com/monis115/nxtWave",
    live: "https://monis115.github.io/nxtWave/",
    metrics: [["framework", "React"], ["status", "live"]]
  },
  {
    id: "WeatherPlugin",
    title: "WP Weather Plugin",
    tagline: "WordPress weather widget",
    desc: "WordPress plugin that renders live weather for the visitor's geolocation, with Delhi as the fallback city. Shortcode + widget, settings screen, API caching.",
    stack: ["PHP", "WordPress", "REST API"],
    cat: "backend",
    year: 2023,
    weight: 25,
    src: "https://github.com/monis115/WeatherPlugin",
    live: null,
    metrics: [["type", "plugin"], ["platform", "WordPress"]]
  },
  {
    id: "WordPress_weather",
    title: "WP Weather — Core",
    tagline: "Stripped plugin core",
    desc: "The lean core of the weather plugin, separated from its bundled WordPress install so the actual plugin logic can be read in one sitting.",
    stack: ["PHP", "WordPress"],
    cat: "backend",
    year: 2023,
    weight: 26,
    src: "https://github.com/monis115/WordPress_weather",
    live: null,
    metrics: [["payload", "62 KB"], ["type", "plugin"]]
  },
  {
    id: "DSA-in-JAVA",
    title: "DSA in Java",
    tagline: "Algorithms & data structures",
    desc: "Working repository of data structures and algorithm solutions in Java — the reps behind the interview-grade problem solving.",
    stack: ["Java", "Algorithms"],
    cat: "lab",
    year: 2024,
    weight: 27,
    src: "https://github.com/monis115/DSA-in-JAVA",
    live: "https://monis115.github.io/DSA-in-JAVA/",
    metrics: [["language", "Java"], ["type", "practice"]]
  },
  {
    id: "AssignmentForkByte",
    title: "ForkByte Landing",
    tagline: "Responsive landing page",
    desc: "Responsive developer landing page built as a studio assignment — fluid grid, breakpoint discipline and no framework crutches.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "lab",
    year: 2023,
    weight: 28,
    src: "https://github.com/monis115/AssignmentForkByte",
    live: "https://monis115.github.io/AssignmentForkByte/",
    metrics: [["type", "landing"], ["status", "live"]]
  },
  {
    id: "forkByte",
    title: "ForkByte — Source",
    tagline: "The working repo",
    desc: "The working copy behind the ForkByte landing page, kept with its raw assets and iterations.",
    stack: ["HTML5", "CSS3"],
    cat: "lab",
    year: 2023,
    weight: 29,
    src: "https://github.com/monis115/forkByte",
    live: null,
    metrics: [["type", "source"], ["status", "archived"]]
  },
  {
    id: "codsoft",
    title: "CodSoft Internship",
    tagline: "Internship task set",
    desc: "Complete task set delivered for the CodSoft internship — multiple standalone builds shipped to deadline.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "lab",
    year: 2023,
    weight: 30,
    src: "https://github.com/monis115/codsoft",
    live: "https://monis115.github.io/codsoft/",
    metrics: [["tasks", "multiple"], ["status", "live"]]
  },
  {
    id: "CompleteWebDevelopmentCourse",
    title: "Web Dev Archive",
    tagline: "Course-length build log",
    desc: "Twenty megabytes of build log — every exercise, mini-site and experiment from a full web development course, kept public rather than polished away.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    cat: "lab",
    year: 2023,
    weight: 31,
    src: "https://github.com/monis115/CompleteWebDevelopmentCourse",
    live: "https://monis115.github.io/CompleteWebDevelopmentCourse/",
    metrics: [["assets", "20 MB"], ["type", "archive"]]
  },
  {
    id: "instamate-slides",
    title: "InstaMate Slides",
    tagline: "Automated carousel pipeline",
    desc: "Public image host for the SINAI InstaMate pipeline — daily Instagram carousels generated and auto-pushed as PNGs, no human in the loop.",
    stack: ["Automation", "CI", "Git"],
    cat: "backend",
    year: 2026,
    weight: 32,
    src: "https://github.com/monis115/instamate-slides",
    live: null,
    metrics: [["mode", "automated"], ["cadence", "daily"]]
  },
  {
    id: "Portfolio",
    title: "This Terminal",
    tagline: "The site you're looking at",
    desc: "Hand-built portfolio shell: boot sequence, matrix rain, glitch typography and a working command interpreter. No framework, no build step, no dependencies — press ` to open the shell and look around.",
    stack: ["HTML5", "CSS3", "JavaScript", "Canvas"],
    cat: "app",
    year: 2026,
    weight: 33,
    src: "https://github.com/monis115/Portfolio",
    live: "https://monis115.github.io/Portfolio/",
    metrics: [["deps", "0"], ["build step", "none"], ["status", "live"]]
  }
];

const STACK = [
  {
    group: "backend",
    items: [
      { name: "Java",          level: 92 },
      { name: "Spring Boot",   level: 90 },
      { name: "Spring Data JPA", level: 86 },
      { name: "REST APIs",     level: 90 },
      { name: "JDBC",          level: 84 },
      { name: "Spring AOP/Mail", level: 78 }
    ]
  },
  {
    group: "frontend",
    items: [
      { name: "Angular 21",    level: 88 },
      { name: "TypeScript",    level: 86 },
      { name: "RxJS",          level: 82 },
      { name: "Angular Material", level: 85 },
      { name: "HTML5 / SCSS",  level: 92 },
      { name: "Chart.js",      level: 78 }
    ]
  },
  {
    group: "data_and_cloud",
    items: [
      { name: "MySQL",         level: 86 },
      { name: "PostgreSQL",    level: 80 },
      { name: "AWS RDS/S3/EB", level: 78 },
      { name: "Docker",        level: 76 },
      { name: "Nginx / SSR",   level: 72 },
      { name: "DSA (500+)",    level: 88 }
    ]
  }
];

const TIMELINE = [
  {
    hash: "a7f31c9",
    date: "Oct 2024 — present",
    title: "Java Backend Developer",
    org: "Tata Consultancy Services",
    body: "Backend engineering on enterprise systems in financial services — Java, JDBC and PostgreSQL, to production standards where being nearly right is the same as being wrong. Project specifics stay with the client. Recognised with two GEM awards and an Employee of the Month for delivery quality."
  },
  {
    hash: "3e8b204",
    date: "Jan 2026 — Mar 2026",
    title: "MedCore — Hospital Billing System",
    org: "Grace Hospital · freelance",
    body: "Built the billing backend: REST APIs for patient, doctor and billing management, automated PDF invoicing, H2 in-memory persistence on Spring Data JPA."
  },
  {
    hash: "c14d7a6",
    date: "Jun 2025 — Dec 2025",
    title: "Full-Stack Developer — CampusConnect",
    org: "Rare Education Private Limited · freelance",
    body: "Sole engineer on a multi-role admission management platform: Angular 21 + Spring Boot 3.5, nine role-based dashboards, 35+ REST controllers, AWS RDS/S3, PDF and Excel pipelines, PWA delivery and a Dockerised deploy to Elastic Beanstalk."
  },
  {
    hash: "9b02fe5",
    date: "2024 — present",
    title: "Founder / Engineer",
    org: "Zorix Lab",
    body: "My own studio: client platforms, brand sites and product builds end to end — education consultancies, restaurants and retail across India, the UK, the US and Central Asia."
  },
  {
    hash: "1d5a880",
    date: "2020 — 2024",
    title: "B.Tech, Computer Science",
    org: "Narula Institute of Technology, Kolkata · CGPA 8.71",
    body: "Four years of fundamentals alongside a public build log: PHP + MySQL platforms, React applications and a DSA practice habit that now stands at 500+ problems solved — LeetCode 240+, CodeChef 190+, HackerRank 5★."
  }
];

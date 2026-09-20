# monis@portfolio:~$

Terminal-styled personal portfolio for **Monis Raza** — software developer, founder of [Zorix Lab](https://www.zorixlab.com/).

**Live:** https://monis115.github.io/Portfolio/

```
41 repositories indexed · 25 live deployments · 0 dependencies
```

## What's in it

| Feature | Detail |
|---|---|
| Boot sequence | Typed POST log on first visit, skippable, remembered per session |
| Matrix rain | Canvas-based, throttled to ~18fps, fades out as you scroll |
| Interactive shell | Press `` ` `` or `⌘K` — `help`, `ls`, `open <project>`, `cat`, `neofetch`, `stack`, `log`, `contact`, `sudo` … with tab-completion and `↑`/`↓` history |
| Project arsenal | Every public repo, filterable by category, with dossier modals and sandboxed live previews |
| Capability matrix | Stack ratings rendered as segment meters |
| Commit history | Career timeline styled as `git log` |
| Contact | Channel list + a form that composes a `mailto:` transmission |
| Targeting reticle | Custom crosshair HUD with live coordinates, snapping on anything interactive |
| Section rail | Right-hand progress rail with scroll percentage and active-section nodes |
| Decode headings | Section titles scramble-decode as they enter the viewport |
| Card tilt | Pointer-tracked 3D tilt with a glare that follows the cursor |
| Telemetry | Animated net/cpu/packet sparkline and a running clock in the hero terminal |
| Live GitHub | Real `last push` stamps on every card plus a "last pushed" activity strip, fetched from the GitHub API and cached for 6h |
| Search & sort | `grep` bar with multi-term search, curated/recent/A→Z sorting, live-only filter |

Extra shell commands: `ping <project>` (measures real latency to a deployment), `gh` (live API stats),
`theme green|amber|cyan|crimson`, `sound` (opt-in keyclick synth).

Easter eggs: the Konami code, `sudo`, `rm -rf`, `matrix`, `hack`.

## Keyboard

| Key | Action |
|---|---|
| `` ` `` / `⌘K` | shell |
| `/` | project search |
| `j` / `k` | move through cards |
| `↵` | open focused card |
| `?` | keyboard map |
| `esc` | close anything |

## Stack

Hand-written HTML5, CSS3 and vanilla JavaScript. **No frameworks, no build step, no dependencies** — the only external request is the JetBrains Mono webfont.

## Structure

```
index.html              markup + SEO/OG metadata
assets/css/main.css     design tokens, atmosphere, components, responsive
assets/js/data.js       profile, projects, stack, timeline  ← edit content here
assets/js/app.js        boot, rain, renderers, search, modal, shell
assets/js/fx.js         reticle, rail, scramble, tilt, telemetry, live GitHub
assets/img/operator.svg the hooded operator plate
assets/img/og.png       social preview card

```

## Editing

All content lives in `assets/js/data.js`. Add a project by appending to `PROJECTS`:

```js
{
  id: "RepoName",
  title: "Display Name",
  tagline: "one line",
  desc: "the paragraph shown in the card and dossier",
  stack: ["HTML5", "JavaScript"],
  cat: "platform" | "backend" | "site" | "app" | "lab",
  year: 2026,
  weight: 1,                     // lower sorts first
  src:  "https://github.com/monis115/RepoName",
  live: "https://monis115.github.io/RepoName/",   // or null
  metrics: [["key", "value"]]
}
```

## Local preview

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

© Monis Raza · [github.com/monis115](https://github.com/monis115)

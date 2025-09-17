## AI Project Instructions: anker-sand.github.io

Concise guidance for automated coding agents working on this Vite + React (JSX) single‑page portfolio with custom path routing and animated transitions. This project is intentionally single-page, with manual path/state sync and animated transitions.

### 1. Architecture & Entry

- Bootstrapped by Vite: `index.html` -> `src/main.jsx` mounts `<App />`.
- No React Router for page content; manual path/state sync in `App.jsx` (`activePage` + `history.replaceState`). (React Router packages are installed but currently unused.)
- Visual sections are "pages" in `src/pages/` (`Home`, `About`, `Projects`, `Contact`) switched via a keyed `<motion.div>` wrapped in `AnimatePresence` for fade transitions.
- Persistent layout: background looping `<video>` + `Navbar` stay mounted; only inner page wrapper remounts.

### 2. Navigation Pattern

- Path <-> state mapping in `App.jsx` (`getPageFromPath`, `pageToPath`).
- On navigation: update `activePage`, effect sets URL with `history.replaceState` (no history stacking) and `window.scrollTo(0,0)`.
- Back/forward handled by `popstate` listener; ensure any new navigation method also updates both state and path consistently.
- If adding official routing (e.g. React Router), preserve current fade & scroll reset behavior; centralize transitions instead of duplicating per route.
- GitHub Pages note: needs 404.html redirect to `index.html` for deep links (mention if adding new paths).

### 3. Animation & Interaction

- Uses `framer-motion` globally for page fades (`opacity` with `mode="wait"`) and for entrance of room scene (`Home.jsx` motion wrapper). Keep transitions short (<0.6s) to avoid perceived lag/flicker.
- Interactive scene objects (`InteractiveObject.jsx`) implement hover tooltips via local state + `position: fixed` coordinates; reuse this component for any clickable hotspot.
- When adding new animated elements, prefer a single parent motion container over many siblings to reduce layout thrash.

### 4. Components & Styling Conventions

- Complex component folders (e.g. `components/Navbar/`); related CSS file colocated (`Navbar.css`, `InteractiveObject.css`). Follow this when adding new components.
- Room / scene assets live under `src/assets/images/room/`; page‑specific images nest under `assets/images/<page>/` if added.
- Use descriptive classNames; avoid global resets beyond what's already in `main.css` / `App.css`.

### 5. Assets & Performance

- Videos: imported from `src/assets/videos/` and inlined by Vite (example: background `sunclouds.mp4`). Keep large media optimized (looping ambient videos should be short + compressed).
- Static JSON (`public/projects.json`) is fetchable at runtime if needed; importing from `public` is not processed by Vite bundler. This file contains project metadata for the portfolio.
- Prefer importing images (ensures hashing) over referencing via `/public` unless truly static external resources.

### 6. Data & Utilities

- The `data/` directory is reserved for future data utilities or static helpers (currently empty or unused).

### 7. Adding Features (Examples)

- New Page: create `src/pages/XYZ.jsx`, add switch case in `renderPage()` inside `App.jsx`, extend `pageToPath` + `getPageFromPath`, add button in `Navbar`.
- New Interactive Object: place PNG in `assets/images/room/`, import in `Home.jsx`, wrap with `<InteractiveObject image={...} tooltipText="..." onClick={() => onNavigate('target')} />`.
- Global Transition Variant: adjust single `motion.div` in `App.jsx`; avoid per-page duplicate fade wrappers.

### 8. Scripts & Tooling

- Dev: `npm run dev` (HMR).
- Build: `npm run build` -> dist output (no custom config beyond `@vitejs/plugin-react-swc`).
- Preview: `npm run preview`.
- Lint: `npm run lint` uses `eslint.config.js` (React + hooks plugins). No tests presently; if adding, document framework here.
- No automated tests are present. If adding tests, document the framework and conventions in this file and the README.

### 9. Dependencies In-Use

- Core: `react`, `react-dom` 19.x.
- Animation: `framer-motion`.
- Icons: `lucide-react` (tree-shake imported icons only).
- NOTE: `react-router` & `react-router-dom` are installed but intentionally not utilized—avoid partial adoption that duplicates existing manual routing.

### 10. Common Pitfalls / Gotchas

- Flicker (page "twitch"): Ensure only one keyed motion container; don't wrap pages themselves again with exit/enter unless removing current pattern. Keep `will-change: opacity` as in `App.jsx`.
- Scroll restoration forcibly set to `manual`; avoid conflicting logic in new components that auto-scroll on mount.
- Tooltips: Because they use `position: fixed`, offset calculations rely on mouse events; avoid wrapping `InteractiveObject` in elements that stop pointer events.

### 11. When Extending

- Update this file + `README.md` when adding routing library, test framework, or asset pipeline changes.
- Keep instructions concise; remove references to unused dependencies if you excise them.

---

For AI changes: Maintain current manual path sync unless fully migrating to React Router in one cohesive PR. Do NOT partially replace manual routing with React Router—choose one pattern only. Consolidate animation patterns; avoid introducing global state libraries prematurely. Prefer incremental, readable diffs.

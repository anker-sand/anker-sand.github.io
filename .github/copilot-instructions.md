## AI Project Instructions: anker-sand.github.io

Concise guidance for AI coding agents working on this Vite + React (JSX) single-page portfolio. The site is intentionally single-page with manual URL/state sync and local animations.

### 1) Architecture overview

- Entry: `index.html` -> `src/main.jsx` mounts `<App />`.
- Manual routing: No React Router. `src/App.jsx` maps path <-> state (`getPageFromPath`, `pageToPath`) and sets `history.replaceState` on changes. Back/forward handled via `popstate`.
- Pages: `src/pages/{Home,About,Projects,Contact}.jsx` are lazy-loaded with `React.lazy` and shown via a simple switch in `App.jsx`.
- Persistent layout: global background `<video>` (clouds), `<Navbar />`, and `<CustomCursor />` stay mounted; only the inner page content switches.

### 2) Navigation pattern (do this when adding links)

- Programmatic nav is via the `onNavigate(pageKey)` prop passed from `App` (see `Navbar.jsx`). Example: `onNavigate("projects")`.
- `history.replaceState` is used (no history stacking); `history.scrollRestoration = 'manual'`. There is no automatic `window.scrollTo(0,0)` on page switch—do not add auto-scroll unless intentional.
- Deep links: On GitHub Pages, ensure a 404.html fallback to `index.html` so `/about`, `/projects`, etc., work on reload.

### 3) Animations & interactions

- `framer-motion` is used locally (not for global page fades). Examples:
	- `components/Navbar/Navbar.jsx`: hover-revealed menu with `AnimatePresence`.
	- `pages/Projects.jsx`: cube entrance, per-word title/subtitle animation, image showcase crossfades, and a resolution modal.
- Keep transitions brief (< ~0.6s) to avoid lag. Prefer a single parent motion container per region to reduce layout thrash.
- `components/Room/objects/InteractiveObject.jsx` provides hover tooltips using `position: fixed` based on mouse events; avoid wrappers that block pointer events.

### 4) Data, assets, and performance

- Project data: `public/projects.json` is fetched at runtime (`/projects.json`). Image URLs in this JSON are absolute `/assets/...` paths under `public/assets/projects/**`.
- In-code images/videos: import from `src/assets/**` for hashing/HMR (e.g., `src/assets/videos/sunclouds.mp4`).
- Background video is paused when the tab is hidden (see the `visibilitychange` handler in `App.jsx`). Keep loops short/compressed.

### 5) Conventions & structure

- Co-locate CSS with components/pages (e.g., `Navbar.css`, `Projects.css`).
- Pages should accept `onNavigate` only if they need to trigger navigation; otherwise keep them self-contained.
- Icons: use tree-shaken imports from `lucide-react`.

### 6) Dev workflows

- Dev: `npm run dev`
- Build: `npm run build` (Vite + `@vitejs/plugin-react-swc`), then `npm run preview` to serve `dist` locally.
- Lint: `npm run lint` (`eslint.config.js` is provided). No tests currently.

### 7) Adding features (practical examples)

- New page: create `src/pages/XYZ.jsx`; extend the switch in `App.jsx`, update `pageToPath` + `getPageFromPath`, and add a button in `Navbar`.
- New project entry: add to `public/projects.json` and place images under `public/assets/projects/<folder>/`. Keep image paths absolute (starting with `/assets/`).
- New interactive hotspot: import `InteractiveObject` in the relevant page and pass `image`, `tooltipText`, and `onClick={() => onNavigate('target')}`.

### 8) Pitfalls / gotchas specific to this repo

- Do not partially introduce React Router; manual path sync is the chosen pattern. If migrating, do it fully in one PR and preserve current behaviors (URL sync, no auto-scroll, local animations).
- Avoid adding global page-level `AnimatePresence`/fade; it was removed to reduce flicker. Keep animations scoped.
- Keep path/state mapping authoritative: always update both when introducing new navigation triggers.
- `react-router`, `react-router-dom`, and `router` are installed but unused; do not rely on them unless refactoring intentionally.

---

For AI changes: Maintain manual path/state sync, lazy-loaded pages, and scoped animations. If you plan a larger refactor (routing, testing, asset pipeline), outline it here and update this file + `README.md` in the same PR.

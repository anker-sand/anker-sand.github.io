# Copilot Instructions for ankerderbanker.github.io

## Project Overview

- **Stack:** React (JSX) + Vite for fast development and HMR.
- **Structure:**
  - `src/` contains all source code.
    - `components/` for reusable UI (e.g., `Navbar`, `Room` with subcomponents like `Cat`, `Mail`).
    - `pages/` for route-level components (`Home.jsx`, `About.jsx`, etc.).
    - `assets/` for images, videos, and animations, organized by type and usage.
  - `public/` for static assets served directly.
  - `notused/` for unused or archived media.
- **Entry Point:** `src/main.jsx` (mounts `App.jsx`).

## Key Patterns & Conventions

- **Component Organization:**
  - Use folders for complex components (e.g., `Navbar/`, `Room/objects/`).
  - CSS modules or component-scoped CSS (e.g., `Navbar.css`).
- **Asset Management:**
  - Reference images/videos from `src/assets/` using relative imports.
  - Large or static files go in `public/`.
- **Routing:**
  - Page components in `src/pages/`.
  - No explicit router found; if adding one, follow this pattern.

## Developer Workflows

- **Start Dev Server:**
  - `npm run dev` (Vite, with HMR)
- **Build for Production:**
  - `npm run build`
- **Preview Production Build:**
  - `npm run preview`
- **Linting:**
  - ESLint config in `eslint.config.js` (JS only, no TypeScript by default)

## Integration & External Dependencies

- **Vite Plugins:**
  - Uses `@vitejs/plugin-react` or `@vitejs/plugin-react-swc` (see `vite.config.js`).
- **No backend or API integration** detected in this repo.

## Project-Specific Notes

- **No TypeScript:** All code is JavaScript/JSX.
- **No test framework** or test files present.
- **No custom scripts** beyond Vite defaults in `package.json`.
- **Unused assets** are kept in `notused/` for reference.

## Examples

- To add a new room object: create a new component in `src/components/Room/objects/` and import it in the parent Room component.
- To add a new page: create a new file in `src/pages/` and link it via the `Navbar`.

---

**For AI agents:**

- Follow the file/folder conventions above.
- Prefer colocating styles with components.
- Use relative imports for assets.
- Keep code modular and organized by feature.
- If adding new workflows or dependencies, update this file and `README.md`.

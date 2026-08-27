# Repository Guidelines

## Project Structure & Module Organization

GamtiWatch is a React 18 stopwatch PWA written in TypeScript and built with Vite. Application code lives in `src/`: `components/` contains UI and timer behavior, `styles/` contains CSS modules, and `firebase.js` holds Firebase integration. Global styles and the application entry points are directly under `src/`. Static files, icons, the web manifest, and the Firebase messaging service worker belong in `public/`; Vite copies them to the build unchanged. Production output is generated in `dist/`. Keep reusable UI in `src/components` and colocate component-specific styles in `src/styles`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependency versions.
- `npm start` starts Vite at `http://localhost:3000` and opens a browser.
- `npm run build` runs strict TypeScript checking, then creates the production bundle in `dist/`.
- `npm run serve` previews the production bundle locally.
- `npm run deploy` builds and publishes `dist/` to the `gh-pages` branch.

There is currently no test script in `package.json`; add one before relying on automated test execution.

## Coding Style & Naming Conventions

Follow the existing React/TypeScript style: two-space indentation, semicolons, double quotes in maintained source files, and functional components. Use `PascalCase` for components and their files (`Stopwatch.tsx`), `camelCase` for functions and state, and `*.module.css` for scoped styles. TypeScript runs with `strict` enabled, so avoid `any` and type component props explicitly. ESLint uses the `react-app` and `react-app/jest` presets.

## Testing Guidelines

Testing Library and Jest DOM are installed, with setup in `src/setupTests.ts`. Place UI tests beside the target module as `*.test.tsx`; prefer user-visible queries and behavior assertions over implementation details. `src/App.test.tsx` is a starter test and should be updated when test execution is configured.

## Commit & Pull Request Guidelines

Recent commits use short prefixes such as `feat :`, `fix :`, `docs :`, and `dev :`. Keep subjects imperative and focused, for example `fix: reset timer when duration changes`. Pull requests should explain the user-facing change, list validation performed, link relevant issues, and include screenshots or recordings for visual changes. Call out Firebase, service-worker, manifest, or deployment-path changes explicitly.

## Security & Configuration

Do not commit private credentials. Treat Firebase client settings as public identifiers, but restrict keys in Firebase/Google Cloud and keep environment-specific values in ignored `.env` files using Vite's `VITE_` prefix.

## Producer–Consumer Visualization

🔗 **Live Demo**: [https://consumer-producer-problem.vercel.app/](https://consumer-producer-problem.vercel.app/)

This project is an interactive visualization of the classic **Producer–Consumer problem**, implemented as a modern web app.

You can explore two variants:
- **Without semaphore**: Shows race conditions and buffer inconsistencies when access is not properly synchronized.
- **With semaphore**: Demonstrates how semaphores coordinate producers and consumers so that the shared buffer is used safely.

The UI lets you:
- Configure the number of producers and consumers.
- Adjust production / consumption speed.
- Observe the shared buffer as items are added and removed.
- Compare behavior **with vs. without** semaphore-style synchronization.

---

## Tech Stack

- **Framework**: `Next.js` (App Router)
- **Language**: `TypeScript`
- **UI Library**: `React`
- **Styling**: `Tailwind CSS`
- **UI Components**: Radix UI + custom components (Shadcn-style)
- **Package Manager**: `pnpm`

Node.js is required to run the project.

---

## Project Structure (high level)

- `app/`
  - `layout.tsx` – Root layout and theme shell.
  - `page.tsx` – Main page that brings together the producer–consumer panels and buffer visualization.
  - `globals.css` – Global styles.
- `components/`
  - `top-navigation.tsx` – App header / navigation.
  - `theme-provider.tsx` – Dark / light theme support.
  - `sync-variables.tsx` – Synchronization controls / shared configuration.
  - `producer-panel.tsx` – Producer controls and status display.
  - `consumer-panel.tsx` – Consumer controls and status display.
  - `control-panel.tsx` – Global controls for the simulation (start/stop, speeds, etc.).
  - `buffer-visualization.tsx` – Visual representation of the shared buffer and its state.
  - `ui/` – Reusable UI primitives (buttons, dialogs, sliders, tabs, tables, toasts, etc.).
- `hooks/`
  - `use-toast.ts` – Toast notification hook.
  - `use-mobile.ts` – Responsive / mobile helper hook.
- `lib/`
  - `utils.ts` – Utility helpers (e.g., class name utilities).
- `styles/`
  - `globals.css` – Additional global styles.

Configuration and tooling:
- `package.json` – Scripts and dependencies.
- `pnpm-lock.yaml` – Exact dependency versions for `pnpm`.
- `tsconfig.json` – TypeScript configuration.
- `next.config.mjs` – Next.js configuration.
- `postcss.config.mjs` – PostCSS / Tailwind configuration.

---

## Getting Started

### Prerequisites

1. **Node.js** (LTS recommended).
2. **pnpm** installed globally:

```bash
npm install -g pnpm
```

### Install dependencies

From the project root:

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Then open the URL shown in the terminal (typically `http://localhost:3000`) in your browser.

---

## Notes for OS Assignment

- This project is intended to **illustrate OS synchronization concepts**, not to act as a kernel-level implementation.
- The **“without semaphore”** mode can be used to discuss:
  - Race conditions
  - Lost updates
  - Inconsistent buffer state
- The **“with semaphore”** mode can be used to discuss:
  - Mutual exclusion
  - Bounded buffer constraints
  - Correct coordination between producers and consumers

You can extend this README with screenshots, algorithm pseudocode, or explanation of your own semaphore logic as you refine the project.


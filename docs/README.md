# SLIM Documentation Site

This is the Hugo-based documentation site for [slim](https://github.com/agntcy/slim). It implements a modern, card-based interface with a responsive layout, dark/light mode switching, glassmorphic menus, and high-performance rendering.

---

## Directory Structure

| Path | Purpose |
|------|---------|
| `content/` | Structured Markdown documentation |
| `layouts/` | Custom HTML layout templates (created from scratch) |
| `assets/css/` | Custom design system stylesheet (`styles.css`) |
| `Taskfile.yml` | Build and serve automation tasks |
| `hugo.toml` | Hugo site configuration |

---

## Prerequisites

Before running the site locally, make sure you have:
1. **Hugo (Extended Edition)**: `brew install hugo` (Version v0.158.0 or newer recommended)
2. **Task**: `brew install go-task` (for automated task runner support)

---

## How to Run Locally

You can run the server directly from the repository root, or from within the `docs/` directory.

### 1. From the Repository Root
Run the following command to start the live-reload Hugo dev server:
```bash
task docs:run
```
This task dynamically scans for an open port between `1313` and `1322` (starting with `1313`) and starts the server there. The console output will print the URL (e.g., `http://127.0.0.1:1313/`).

### 2. From the `docs/` Directory
You can also run it directly using:
```bash
cd docs
task run
```

---

## How to Build the Static Site

If you need to generate the production-ready static HTML bundle:

### 1. From the Repository Root
```bash
task docs:build
```

### 2. From the `docs/` Directory
```bash
cd docs
task build
```

The output will be generated inside the `.build/site/` directory at the root of the repository (e.g. `slim/.build/site/index.html`).

---

## Key Features & Customizations

- **UX Design**: Styled from scratch with **Plus Jakarta Sans** and **JetBrains Mono** font pairings.
- **Theme Switcher**: Minimal-JS, instant light/dark mode transition with local storage persistence.
- **Glassmorphic Navigation**: Sidebar and header featuring `backdrop-filter: blur(12px)` and subtle glowing borders.
- **Card Grid Layout**: An intuitive homepage card grid and section list layout to categorize content visually.
- **Shortcodes**: Supports `{{< cards >}}`, `{{< card >}}`, and custom color-coded `{{< callout >}}` components for warning and information callouts.

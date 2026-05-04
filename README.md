# KPI Note Taker

A simple, elegant note-taking application designed for use on GitHub Pages. It allows users to create, edit, pin, archive, and filter notes entirely client-side using `localStorage` for persistence.

## Features

- Create, Edit, Delete Notes
- Add tags to organize notes
- Pin important notes to the top
- Archive old notes
- Instant client-side search and tag filtering
- Data persists in browser `localStorage`
- Fully responsive modern UI

## How to Run Locally

Since this is a plain HTML/CSS/JS static app with ES Modules:

1. Clone the repository.
2. Serve the root directory using any local web server. For example:
   ```bash
   npx serve .
   ```
   Or using Python:
   ```bash
   python -m http.server
   ```
3. Open the provided local URL in your browser.

## Deployment

This app is configured to deploy automatically to GitHub Pages.

1. Ensure GitHub Actions are enabled in your repository.
2. Ensure GitHub Pages is set to deploy from GitHub Actions (Settings > Pages > Source > GitHub Actions).
3. Pushing to the `main` branch will trigger the workflow in `.github/workflows/pages.yml` and publish the site.

## Architecture

See `docs/sdr/` for details on technical decisions:
- Plain HTML/CSS/JS without build steps
- `localStorage` for all persistence
- In-memory data manipulation and filtering

# Stack Choice

## Context
The application needs to be delivered on GitHub Pages without a backend. The requirements describe a simple note-taking SPA with creation, editing, deletion, archiving, tagging, pinning, and instant client-side filtering. No complex multi-view state or highly interactive sub-components are necessary.

## Decision
We will use **Plain HTML, CSS, and vanilla JavaScript (ES modules)** without any build step or framework. 

## Options Considered
1. **Plain HTML/CSS/JS**: Lowest overhead, directly served by GitHub Pages, sufficient for simple DOM manipulation.
2. **Vite + vanilla JS**: Would provide bundling, but no significant advantage for an app of this small size.
3. **Vite + React**: Overkill for a basic CRUD app without complex state sharing.

## Consequences
- Fast deployment via simple static action.
- Lightweight and minimal dependencies.
- Need to manually manipulate DOM for rendering notes and handling form inputs, which is acceptable given the scale.

## Requirements touched
- All functional and non-functional requirements (especially NFR2, NFR3, and general GitHub Pages feasibility).

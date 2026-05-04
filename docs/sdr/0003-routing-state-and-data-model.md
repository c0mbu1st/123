# Routing, State, and Data Model

## Context
We are building a single-page application (SPA) with plain HTML/JS for note-taking. We need to handle filtering, archiving, and displaying a list of notes.

## Decision
- **Routing**: No URL-based routing is strictly necessary. We will use a simple tab or section toggle in JS to switch between "Active Notes" and "Archive".
- **State**: In-memory state (array of note objects) initialized from `localStorage` on load, and written back to `localStorage` on any mutation.
- **Data Model**:
  ```typescript
  type Note = {
    id: string;          // UUID or timestamp-based ID
    title: string;       // 3-50 chars
    text: string;        // max 500 chars
    tags: string[];      // lowercase, unique
    isPinned: boolean;
    isArchived: boolean;
    createdAt: number;   // timestamp
  }
  ```

## Options Considered
- **URL Hash Routing**: Might be useful for linking to the archive, but not explicitly requested. A simple JS toggle is faster to implement.
- **Separate storage keys for archive vs active**: Kept in one array to simplify the data model; filtering is fast enough for the expected scale.

## Consequences
- The application logic will reside in a few ES modules (e.g., `store.js` for data access, `ui.js` for DOM manipulation, `app.js` as the entry point).
- Filtering and sorting will be executed entirely in memory every time the list is rendered, satisfying NFR3 (instant response).

## Requirements touched
- BR1: Priority sorting (pinned then date).
- BR2: Unique lowercase tags.
- NFR3: Instant client-side filtering.

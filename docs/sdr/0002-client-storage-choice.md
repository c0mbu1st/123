# Client Storage Choice

## Context
The application must persist data across page reloads (NFR1) but has no backend. It is a single-user note-taking application. We need to store notes, including their text, tags, creation dates, and statuses (pinned, archived).

## Decision
We will use **`localStorage`**.

## Options Considered
1. **`localStorage`**: Explicitly required by NFR1. Simple synchronous API, well-suited for small sets of personal notes.
2. **`IndexedDB`**: More powerful and suitable for large datasets, but overkill since the requirements explicitly state `localStorage` and the data is simple.
3. **`sessionStorage`**: Does not persist across tabs/sessions, violates NFR1.

## Consequences
- Data is constrained by browser `localStorage` limits (~5MB), which is perfectly fine for text notes.
- Data is strictly single-user and device-specific.
- Simple synchronous serialization/deserialization (JSON.stringify/parse) is required on read/write.

## Requirements touched
- NFR1: Збереження даних (Data persistence)
- All CRUD functional requirements.

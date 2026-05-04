import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  resetDemoData
} from './store.js';

// DOM Elements
const notesContainer = document.getElementById('notes-container');
const emptyState = document.getElementById('empty-state');
const emptyStateText = document.getElementById('empty-state-text');
const noteForm = document.getElementById('note-form');
const noteIdInput = document.getElementById('note-id');
const noteTitleInput = document.getElementById('note-title');
const noteTextInput = document.getElementById('note-text');
const noteTagsInput = document.getElementById('note-tags');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const resetDemoBtn = document.getElementById('reset-demo');
const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('search-input');
const tagFilterInput = document.getElementById('tag-filter-input');

// State
let currentTab = 'active'; // 'active' or 'archive'
let searchQuery = '';
let tagQuery = '';

// Icons (SVG strings)
const pinIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`; // Fallback pin icon looks like paperclip
const pinIconFilled = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76z"/></svg>`;
const pinIconOutline = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76z"/></svg>`;
const editIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const deleteIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
const archiveIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`;
const unarchiveIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><rect x="1" y="3" width="22" height="5"/><polyline points="12 17 12 12 15 12"/><polyline points="9 14 12 11 15 14"/></svg>`;

// Initialize
function init() {
  if (getNotes().length === 0) {
    resetDemoData();
  }
  render();
}

// Render Notes
function render() {
  let notes = getNotes();
  
  // Filter by tab
  notes = notes.filter(n => currentTab === 'active' ? !n.isArchived : n.isArchived);
  
  // Search and Filter
  if (searchQuery) {
    notes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  if (tagQuery) {
    notes = notes.filter(n => n.tags.some(t => t.includes(tagQuery.toLowerCase())));
  }

  // Sort: Pinned first, then by date descending
  notes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });

  notesContainer.innerHTML = '';

  if (notes.length === 0) {
    notesContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');
    
    if (searchQuery || tagQuery) {
      emptyStateText.textContent = 'No notes found matching your search criteria.';
    } else if (currentTab === 'archive') {
      emptyStateText.textContent = 'Archive is empty.';
    } else {
      emptyStateText.textContent = 'No active notes. Create one to get started!';
    }
  } else {
    notesContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    notes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'card note-card';
      
      const tagsHtml = note.tags.map(t => `<span class="tag">${t}</span>`).join('');
      const dateStr = new Date(note.createdAt).toLocaleString();
      
      card.innerHTML = `
        <div class="note-header">
          <h3 class="note-title">${escapeHtml(note.title)}</h3>
          <button class="pin-icon ${note.isPinned ? 'pinned' : ''}" data-id="${note.id}" data-action="pin" title="${note.isPinned ? 'Unpin' : 'Pin'}">
            ${note.isPinned ? pinIconFilled : pinIconOutline}
          </button>
        </div>
        <div class="note-text">${escapeHtml(note.text)}</div>
        ${tagsHtml ? `<div class="note-tags">${tagsHtml}</div>` : ''}
        <div class="note-footer">
          <span class="note-date">${dateStr}</span>
          <div class="note-actions">
            <button class="action-btn edit" data-id="${note.id}" data-action="edit" title="Edit">
              ${editIcon}
            </button>
            <button class="action-btn archive" data-id="${note.id}" data-action="archive" title="${note.isArchived ? 'Unarchive' : 'Archive'}">
              ${note.isArchived ? unarchiveIcon : archiveIcon}
            </button>
            <button class="action-btn delete" data-id="${note.id}" data-action="delete" title="Delete">
              ${deleteIcon}
            </button>
          </div>
        </div>
      `;
      notesContainer.appendChild(card);
    });
  }
}

// Event Listeners
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = noteIdInput.value;
  const title = noteTitleInput.value.trim();
  const text = noteTextInput.value.trim();
  const tags = noteTagsInput.value.trim();

  if (id) {
    updateNote(id, title, text, tags);
  } else {
    createNote(title, text, tags);
  }

  resetForm();
  render();
});

cancelEditBtn.addEventListener('click', resetForm);

resetDemoBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset demo data? This will overwrite your current notes.')) {
    resetDemoData();
    resetForm();
    currentTab = 'active';
    updateTabs();
    searchInput.value = '';
    tagFilterInput.value = '';
    searchQuery = '';
    tagQuery = '';
    render();
  }
});

tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    currentTab = e.target.dataset.tab;
    updateTabs();
    render();
  });
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  render();
});

tagFilterInput.addEventListener('input', (e) => {
  tagQuery = e.target.value;
  render();
});

notesContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === 'pin') {
    togglePin(id);
    render();
  } else if (action === 'archive') {
    toggleArchive(id);
    render();
  } else if (action === 'delete') {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      render();
    }
  } else if (action === 'edit') {
    startEdit(id);
  }
});

// Helpers
function resetForm() {
  noteForm.reset();
  noteIdInput.value = '';
  formTitle.textContent = 'Create Note';
  cancelEditBtn.classList.add('hidden');
}

function startEdit(id) {
  const note = getNotes().find(n => n.id === id);
  if (note) {
    noteIdInput.value = note.id;
    noteTitleInput.value = note.title;
    noteTextInput.value = note.text;
    noteTagsInput.value = note.tags.join(', ');
    formTitle.textContent = 'Edit Note';
    cancelEditBtn.classList.remove('hidden');
    noteTitleInput.focus();
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function updateTabs() {
  tabs.forEach(tab => {
    if (tab.dataset.tab === currentTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

// Start app
init();

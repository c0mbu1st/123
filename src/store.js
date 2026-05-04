export const STORAGE_KEY = 'kpi26-notes-data';

export const getNotes = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveNotes = (notes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const resetDemoData = () => {
  const demoData = [
    {
      id: crypto.randomUUID(),
      title: 'Welcome Note',
      text: 'This is your first note. You can edit, delete, or archive it. Try pinning it to keep it at the top!',
      tags: ['welcome', 'demo'],
      isPinned: true,
      isArchived: false,
      createdAt: Date.now() - 100000
    },
    {
      id: crypto.randomUUID(),
      title: 'Idea: App features',
      text: 'Implement drag and drop in the future. Maybe add some markdown support?',
      tags: ['idea', 'future'],
      isPinned: false,
      isArchived: false,
      createdAt: Date.now() - 50000
    },
    {
      id: crypto.randomUUID(),
      title: 'Old meeting notes',
      text: 'Discussed project timeline and resources. Need to follow up with the team next week.',
      tags: ['meeting', 'work'],
      isPinned: false,
      isArchived: true,
      createdAt: Date.now() - 500000
    }
  ];
  saveNotes(demoData);
};

export const processTags = (tagsStr) => {
  if (!tagsStr) return [];
  const tags = tagsStr.split(/[\s,]+/).filter(t => t.trim() !== '').map(t => t.toLowerCase());
  return [...new Set(tags)];
};

export const createNote = (title, text, tagsStr) => {
  const notes = getNotes();
  const newNote = {
    id: crypto.randomUUID(),
    title,
    text,
    tags: processTags(tagsStr),
    isPinned: false,
    isArchived: false,
    createdAt: Date.now()
  };
  notes.push(newNote);
  saveNotes(notes);
};

export const updateNote = (id, title, text, tagsStr) => {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index !== -1) {
    notes[index].title = title;
    notes[index].text = text;
    notes[index].tags = processTags(tagsStr);
    saveNotes(notes);
  }
};

export const deleteNote = (id) => {
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
};

export const togglePin = (id) => {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);
  if (note) {
    note.isPinned = !note.isPinned;
    saveNotes(notes);
  }
};

export const toggleArchive = (id) => {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);
  if (note) {
    note.isArchived = !note.isArchived;
    saveNotes(notes);
  }
};

class NotesApp {
    constructor() {
        this.API_URL = '/api/notes';
        this.notesList = document.getElementById('notes-list');
        this.noteForm = document.getElementById('note-form');
        this.titleInput = document.getElementById('title');
        this.contentInput = document.getElementById('content');
        this.errorDiv = document.getElementById('error');
        
        this.currentNoteId = null;
        this.isEditing = false;
        
        this.init();
    }

    init() {
        this.noteForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.loadNotes();
    }

    async loadNotes() {
        try {
            const response = await fetch(this.API_URL);
            const notes = await response.json();
            this.displayNotes(notes);
        } catch (error) {
            this.showError('Failed to load notes');
        }
    }

    displayNotes(notes) {
        this.notesList.innerHTML = notes.map(note => `
            <div class="note" data-id="${note.id}">
                <h3>${this.escapeHtml(note.title)}</h3>
                <p>${this.escapeHtml(note.content)}</p>
                <div class="note-actions">
                    <button class="btn btn-primary" onclick="app.editNote(${note.id})">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteNote(${note.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const noteData = {
            title: this.titleInput.value.trim(),
            content: this.contentInput.value.trim()
        };

        if (!noteData.title || !noteData.content) {
            this.showError('Title and content are required');
            return;
        }

        try {
            if (this.isEditing) {
                await this.updateNote(this.currentNoteId, noteData);
            } else {
                await this.createNote(noteData);
            }

            this.resetForm();
            this.loadNotes();
        } catch (error) {
            this.showError('Failed to save note');
        }
    }

    async createNote(noteData) {
        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) throw new Error('Failed to create note');
    }

    async updateNote(id, noteData) {
        const response = await fetch(`${this.API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) throw new Error('Failed to update note');
    }

    async deleteNote(id) {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete note');

            this.loadNotes();
        } catch (error) {
            this.showError('Failed to delete note');
        }
    }

    editNote(id) {
        const noteElement = document.querySelector(`.note[data-id="${id}"]`);
        const title = noteElement.querySelector('h3').textContent;
        const content = noteElement.querySelector('p').textContent;

        this.titleInput.value = title;
        this.contentInput.value = content;
        this.currentNoteId = id;
        this.isEditing = true;

        document.querySelector('button[type="submit"]').textContent = 'Update Note';
    }

    resetForm() {
        this.noteForm.reset();
        this.currentNoteId = null;
        this.isEditing = false;
        this.errorDiv.textContent = '';
        this.errorDiv.style.display = "none";
        document.querySelector('button[type="submit"]').textContent = 'Add Note';
    }

    showError(message) {
        this.errorDiv.style.display = "flex";
        this.errorDiv.textContent = message;
        setTimeout(() => {
            this.errorDiv.textContent = '';
            this.errorDiv.style.display = "none"
        }, 3000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the app
const app = new NotesApp();

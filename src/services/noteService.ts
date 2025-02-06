import { Note, CreateNoteDTO, UpdateNoteDTO } from "../types";

class NoteService {
  private notes: Note[] = [];
  private nextId: number = 1;

  async getAllNotes(): Promise<Note[]> {
    return this.notes;
  }

  async getNoteById(id: number): Promise<Note | undefined> {
    return this.notes.find((note) => note.id === id);
  }

  async createNote(noteData: CreateNoteDTO): Promise<Note> {
    const newNote: Note = {
      id: this.nextId++,
      ...noteData,
      createdAt: new Date(),
    };
    this.notes.push(newNote);
    return newNote;
  }

  async updateNote(
    id: number,
    noteData: UpdateNoteDTO
  ): Promise<Note | undefined> {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return undefined;

    this.notes[noteIndex] = {
      ...this.notes[noteIndex],
      ...noteData,
      updatedAt: new Date(),
    };

    return this.notes[noteIndex];
  }

  async deleteNote(id: number): Promise<boolean> {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return false;

    this.notes.splice(noteIndex, 1);
    return true;
  }
}

export default new NoteService();

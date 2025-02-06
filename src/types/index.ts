export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
}

export interface UpdateNoteDTO {
  title?: string;
  content?: string;
}

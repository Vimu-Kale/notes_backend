import { Request, Response, NextFunction } from "express";
import noteService from "../services/noteService";
import { CreateNoteDTO, UpdateNoteDTO } from "../types";

export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const note = await noteService.getNoteById(parseInt(req.params.id));
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const noteData = req.body as CreateNoteDTO;
    if (!noteData.title || !noteData.content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }
    const newNote = await noteService.createNote(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const noteData = req.body as UpdateNoteDTO;
    const updatedNote = await noteService.updateNote(
      parseInt(req.params.id),
      noteData
    );
    if (!updatedNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const success = await noteService.deleteNote(parseInt(req.params.id));
    if (!success) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

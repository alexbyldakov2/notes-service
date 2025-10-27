import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Note } from '../entities/Note';

const noteRepository = AppDataSource.getRepository(Note);

export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const notes = await noteRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const note = await noteRepository.findOne({ where: { id } });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const note = noteRepository.create({ title, content });
    const savedNote = await noteRepository.save(note);

    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const note = await noteRepository.findOne({ where: { id } });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    const updatedNote = await noteRepository.save(note);
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const note = await noteRepository.findOne({ where: { id } });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    await noteRepository.remove(note);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
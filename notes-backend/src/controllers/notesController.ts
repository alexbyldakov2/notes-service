import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Note } from '../entities/Note';
import { Category } from '../entities/Category';
import { CreateNoteDto } from '../dto/CreateNoteDto';
import { UpdateNoteDto } from '../dto/UpdateNoteDto';

const noteRepository = AppDataSource.getRepository(Note);
const categoryRepository = AppDataSource.getRepository(Category);

export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.query.category ? parseInt(req.query.category as string) : undefined;
    
    let query = noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .orderBy('note.createdAt', 'DESC');

    if (categoryId) {
      query = query.where('note.categoryId = :categoryId', { categoryId });
    }

    const notes = await query.getMany();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const note = await noteRepository.findOne({ 
      where: { id },
      relations: ['category']
    });

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
    const { title, content, categoryId }: CreateNoteDto = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    let category: Category | null = null;
    if (categoryId) {
      category = await categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        res.status(400).json({ error: 'Category not found' });
        return;
      }
    }

    const note = noteRepository.create({ 
      title, 
      content, 
      category,
      categoryId: category?.id || null
    });

    const savedNote = await noteRepository.save(note);
    
    // Загружаем полные данные с категорией
    const fullNote = await noteRepository.findOne({ 
      where: { id: savedNote.id },
      relations: ['category']
    });

    res.status(201).json(fullNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, categoryId }: UpdateNoteDto = req.body;

    const note = await noteRepository.findOne({ 
      where: { id },
      relations: ['category']
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    // Обработка категории
    if (categoryId !== undefined) {
      if (categoryId === null) {
        note.category = null;
        note.categoryId = null;
      } else {
        const category = await categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
          res.status(400).json({ error: 'Category not found' });
          return;
        }
        note.category = category;
        note.categoryId = categoryId;
      }
    }

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
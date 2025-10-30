import { AppDataSource } from '../config/database';
import { Note } from '../entities/Note';
import { Category } from '../entities/Category';

export const clearDatabase = async (): Promise<void> => {
    const noteRepository = AppDataSource.getRepository(Note);
    const categoryRepository = AppDataSource.getRepository(Category);

    await noteRepository.createQueryBuilder().delete().from(Note).execute();
    await categoryRepository.createQueryBuilder().delete().from(Category).execute();
};

export const createTestNote = async (title: string, content: string, categoryId?: number): Promise<Note> => {
    const noteRepository = AppDataSource.getRepository(Note);
    const note = new Note();
    note.title = title;
    note.content = content;

    if (categoryId) {
        note.categoryId = categoryId;
    }

    const savedNote = await noteRepository.save(note);
    return savedNote;
};
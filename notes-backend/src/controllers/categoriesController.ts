import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { Note } from '../entities/Note';
import { CreateCategoryDto } from '../dto/CreateCategoryDto';
import { UpdateCategoryDto } from '../dto/UpdateCategoryDto';

const categoryRepository = AppDataSource.getRepository(Category);
const noteRepository = AppDataSource.getRepository(Note);

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await categoryRepository.find({
            order: { name: 'ASC' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoryRepository.findOne({
            where: { id },
            relations: ['notes']
        });

        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, color }: CreateCategoryDto = req.body;

        if (!name) {
            res.status(400).json({ error: 'Category name is required' });
            return;
        }

        // Проверяем, существует ли категория с таким именем
        const existingCategory = await categoryRepository.findOne({ where: { name } });
        if (existingCategory) {
            res.status(409).json({ error: 'Category with this name already exists' });
            return;
        }

        const category = categoryRepository.create({
            name,
            color: color || '#3B82F6'
        });

        const savedCategory = await categoryRepository.save(category);
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { name, color }: UpdateCategoryDto = req.body;

        const category = await categoryRepository.findOne({ where: { id } });

        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }

        // Если меняем имя, проверяем уникальность
        if (name && name !== category.name) {
            const existingCategory = await categoryRepository.findOne({ where: { name } });
            if (existingCategory) {
                res.status(409).json({ error: 'Category with this name already exists' });
                return;
            }
            category.name = name;
        }

        if (color !== undefined) category.color = color;

        const updatedCategory = await categoryRepository.save(category);
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const category = await categoryRepository.findOne({
            where: { id },
            relations: ['notes']
        });

        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }

        // Устанавливаем category_id в null для всех заметок этой категории
        if (category.notes && category.notes.length > 0) {
            await noteRepository
                .createQueryBuilder()
                .update(Note)
                .set({ categoryId: null })
                .where('categoryId = :id', { id })
                .execute();
        }

        await categoryRepository.remove(category);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
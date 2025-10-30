import request from 'supertest';
import app from '../app';
import { clearDatabase, createTestNote } from './test-utils';

describe('Notes API', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    describe('GET /api/notes', () => {
        it('Если заметок нет, возвращаем пустой массив', async () => {
            const response = await request(app).get('/api/notes');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('Возвращаем все заметки', async () => {
            await createTestNote('Test Note 1', 'Content 1');
            await createTestNote('Test Note 2', 'Content 2');

            const response = await request(app).get('/api/notes');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Test Note 2');
        });
    });

    describe('POST /api/notes', () => {
        it('Создание новой заметки', async () => {
            const noteData = {
                title: 'New Note',
                content: 'Note content'
            };

            const response = await request(app)
                .post('/api/notes')
                .send(noteData);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(noteData.title);
            expect(response.body.content).toBe(noteData.content);
            expect(response.body.id).toBeDefined();
        });

        it('Ошибка 400 при некорректных параметрах', async () => {
            const response = await request(app)
                .post('/api/notes')
                .send({ title: '' }); // missing content

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/notes/:id', () => {
        it('Возвращение заметки по id', async () => {
            const note = await createTestNote('Test Note', 'Content');

            const response = await request(app).get(`/api/notes/${note.id}`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Note');
        });

        it('Ошибка 404, если заметки не существует', async () => {
            const response = await request(app).get('/api/notes/999');

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/notes/:id', () => {
        it('Обновление заметки', async () => {
            const note = await createTestNote('Old Title', 'Old Content');

            const response = await request(app)
                .patch(`/api/notes/${note.id}`)
                .send({ title: 'New Title' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('New Title');
            expect(response.body.content).toBe('Old Content');
        });
    });

    describe('DELETE /api/notes/:id', () => {
        it('Удаление заметки', async () => {
            const note = await createTestNote('Test Note', 'Content');

            const response = await request(app).delete(`/api/notes/${note.id}`);

            expect(response.status).toBe(204);

            const getResponse = await request(app).get(`/api/notes/${note.id}`);
            expect(getResponse.status).toBe(404);
        });
    });
});
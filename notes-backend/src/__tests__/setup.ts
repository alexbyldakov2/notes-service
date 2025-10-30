import { AppDataSource } from '../config/database';

// Глобальные таймауты
jest.setTimeout(30000);

// Хуки для работы с базой данных
beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});
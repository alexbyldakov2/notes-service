module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.(test|spec).ts', // Только файлы с .test.ts или .spec.ts
        '**/*.(test|spec).ts'
    ],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/app.ts',
        '!src/**/*.d.ts',
        '!src/__tests__/setup.ts', // Исключаем из покрытия
        '!src/__tests__/test-utils.ts' // Исключаем из покрытия
    ],
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    // Явно указываем какие файлы игнорировать
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/__tests__/setup.ts',
        '/src/__tests__/test-utils.ts'
    ]
};
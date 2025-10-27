import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Category } from './types';

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref<Category[]>([
        {
            id: 1,
            name: 'Все заметки',
            color: 'bg-gradient-to-r from-blue-500 to-purple-600',
        },
    ]);

    const currentCategory = ref<Category | undefined>(categories.value[0]);

    const setCurrentCategory = (category: Category) => {
        currentCategory.value = category;
    };

    return {
        categories,
        currentCategory,
        setCurrentCategory,
    };
});
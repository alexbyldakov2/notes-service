<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoriesStore, CategoryCard, useNotesStore } from '@/entities'
import type { Category } from '@/entities'

const categoriesStore = useCategoriesStore()
const notesStore = useNotesStore()

const { categories, currentCategory } = storeToRefs(categoriesStore)
const { notes } = storeToRefs(notesStore)

const selectCategory = (category: Category) => {
    categoriesStore.setCurrentCategory(category)
}

const getNoteCount = (category: Category) => {
    // Пока все заметки относятся к категории "Все заметки"
    if (category.name === 'Все заметки') {
        return notes.value.length
    }
    return 0
}
</script>

<template>
    <div class="bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-2xl shadow-inner">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Категории</h2>

        <div class="space-y-4">
            <CategoryCard v-for="category in categories" :key="category.id" :category="category"
                :is-selected="currentCategory?.id === category.id" :note-count="getNoteCount(category)"
                @selected="selectCategory(category)" />
        </div>

        <!-- Место для будущих категорий -->
        <div class="mt-8 p-4 bg-white bg-opacity-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <p class="text-gray-500 text-sm">Добавить категорию</p>
            <button class="mt-2 text-primary-500 hover:text-primary-600 transition-colors">
                <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    </div>
</template>
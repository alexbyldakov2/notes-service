<script setup lang="ts">
import type { Note } from '../model/types'

interface Props {
    note: Note
    isSelected: boolean
    showDelete?: boolean
}

withDefaults(defineProps<Props>(), {
    showDelete: true
})

defineEmits<{
    selected: []
    delete: []
}>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
</script>

<template>
    <div :class="[
        'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected
            ? 'border-primary-500 bg-primary-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300'
    ]" @click="$emit('selected')">
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800 text-lg truncate flex-1 mr-2">
                {{ note.title }}
            </h3>
            <button v-if="showDelete" @click.stop="$emit('delete')"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>

        <p class="text-gray-600 text-sm line-clamp-2 mb-3">
            {{ note.content }}
        </p>

        <div class="text-xs text-gray-400 flex justify-between items-center">
            <span>Создано: {{ formatDate(note.createdAt) }}</span>
        </div>
        <div class="text-xs text-gray-400 flex justify-between items-center">
            <span v-if="note.updatedAt !== note.createdAt" class="text-orange-500">
                Изменено: {{ formatDate(note.updatedAt) }}
            </span>
        </div>
    </div>
</template>
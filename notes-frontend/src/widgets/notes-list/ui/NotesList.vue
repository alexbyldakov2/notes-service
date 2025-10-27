<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotesStore, NoteCard } from '@/entities'
import { NoteButton, NoteLoader } from '@/shared'

const notesStore = useNotesStore()
const { notes, currentNote, isLoading } = storeToRefs(notesStore)

defineEmits<{
    createNote: []
    noteSelected: [id: number]
    noteDeleted: [id: number]
}>()
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Мои заметки</h2>
            <NoteButton @click="$emit('createNote')" class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Новая заметка
            </NoteButton>
        </div>

        <NoteLoader v-if="isLoading" />

        <div v-else-if="notes.length === 0" class="flex-1 flex items-center justify-center">
            <div class="text-center text-gray-500">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-lg mb-2">Заметок пока нет</p>
                <NoteButton @click="$emit('createNote')">Создать первую заметку</NoteButton>
            </div>
        </div>

        <div v-else class="flex-1 overflow-y-auto space-y-3 pr-2">
            <NoteCard v-for="note in notes" :key="note.id" :note="note" :is-selected="currentNote?.id === note.id"
                @selected="$emit('noteSelected', note.id)" @delete="$emit('noteDeleted', note.id)" />
        </div>
    </div>
</template>
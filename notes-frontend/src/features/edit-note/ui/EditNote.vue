<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { storeToRefs } from "pinia";
import { useNotesStore } from '@/entities'
//import type { Note } from '@/entities/note/model/types'
import { NoteButton, NoteInput, NoteLoader, TextArea } from '@/shared'

// interface Props {
//     noteId: number | null
// }

//const props = defineProps<Props>()
const notesStore = useNotesStore()
const { currentNote } = storeToRefs(notesStore)

const isSubmitting = ref(false)
const errors = reactive({
    title: '',
    content: ''
})

const form = reactive({
    title: '',
    content: ''
})

const note = computed(() => currentNote.value)

// Следим за изменениями текущей заметки
watch(note, (newNote) => {
    if (newNote) {
        form.title = newNote.title
        form.content = newNote.content
    }
}, { immediate: true })

const hasChanges = computed(() => {
    if (!note.value) return false
    return form.title !== note.value.title || form.content !== note.value.content
})

const validateForm = () => {
    let isValid = true

    errors.title = ''
    errors.content = ''

    if (!form.title.trim()) {
        errors.title = 'Заголовок обязателен'
        isValid = false
    } else if (form.title.length > 255) {
        errors.title = 'Заголовок слишком длинный'
        isValid = false
    }

    if (!form.content.trim()) {
        errors.content = 'Содержимое обязательно'
        isValid = false
    }

    return isValid
}

const resetForm = () => {
    if (note.value) {
        form.title = note.value.title
        form.content = note.value.content
    }
    errors.title = ''
    errors.content = ''
}

const handleSubmit = async () => {
    if (!note.value || !validateForm()) return

    isSubmitting.value = true

    try {
        await notesStore.updateNote(note.value.id, {
            title: form.title,
            content: form.content
        })
    } catch (error) {
        console.error('Failed to update note:', error)
    } finally {
        isSubmitting.value = false
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

defineEmits<{
    delete: [id: number]
}>()
</script>

<template>
    <div class="h-full flex flex-col" v-if="note">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Редактирование</h2>
            <div class="flex gap-2">
                <NoteButton variant="danger" @click="$emit('delete', note.id)" class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Удалить
                </NoteButton>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="flex-1 flex flex-col">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                <NoteInput v-model="form.title" placeholder="Введите заголовок заметки..." :error="!!errors.title" />
                <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
            </div>

            <div class="flex-1 flex flex-col mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Содержимое</label>
                <TextArea v-model="form.content" placeholder="Начните писать вашу заметку..." :rows="12"
                    :error="!!errors.content" class="flex-1" />
                <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
            </div>

            <div class="flex gap-3">
                <NoteButton type="submit" :disabled="isSubmitting || !hasChanges" class="flex items-center gap-2">
                    <NoteLoader v-if="isSubmitting" class="w-4 h-4" />
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ isSubmitting ? 'Сохранение...' : 'Сохранить' }}
                </NoteButton>

                <NoteButton variant="secondary" type="button" @click="resetForm" :disabled="isSubmitting">
                    Сброс
                </NoteButton>
            </div>

            <div class="mt-4 text-xs text-gray-500 space-y-1">
                <div>Создано: {{ formatDate(note.createdAt) }}</div>
                <div v-if="note.updatedAt !== note.createdAt">
                    Изменено: {{ formatDate(note.updatedAt) }}
                </div>
            </div>
        </form>
    </div>

    <div v-else class="h-full flex items-center justify-center">
        <div class="text-center text-gray-500">
            <NoteLoader class="w-8 h-8 mx-auto mb-4" />
            <p>Загрузка заметки...</p>
        </div>
    </div>
</template>
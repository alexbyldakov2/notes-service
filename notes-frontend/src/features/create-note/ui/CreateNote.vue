<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNotesStore } from '@/entities'
import { NoteButton, NoteInput, NoteLoader, TextArea } from '@/shared'

const emit = defineEmits<{
    created: []
    cancel: []
}>()

const notesStore = useNotesStore()

const isSubmitting = ref(false)
const errors = reactive({
    title: '',
    content: ''
})

const form = reactive({
    title: '',
    content: ''
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

const handleSubmit = async () => {
    if (!validateForm()) return

    isSubmitting.value = true

    try {
        await notesStore.createNote({
            title: form.title,
            content: form.content
        })

        // Сброс формы
        form.title = ''
        form.content = ''
        errors.title = ''
        errors.content = ''

        emit('created')
    } catch (error) {
        console.error('Failed to create note:', error)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Новая заметка</h2>
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
                <NoteButton type="submit" :disabled="isSubmitting" class="flex items-center gap-2">
                    <NoteLoader v-if="isSubmitting" class="w-4 h-4" />
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ isSubmitting ? 'Создание...' : 'Создать заметку' }}
                </NoteButton>

                <NoteButton variant="secondary" type="button" @click="$emit('cancel')" :disabled="isSubmitting">
                    Отмена
                </NoteButton>
            </div>
        </form>
    </div>
</template>
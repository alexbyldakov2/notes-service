<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesStore } from '@/entities'
import { CategorySidebar, NotesList } from '@/widgets'
import { CreateNote, EditNote } from '@/features'

const notesStore = useNotesStore()

const selectedNoteId = ref<number | null>(null)
const isCreating = ref(false)

onMounted(async () => {
    await notesStore.fetchNotes()
})

const showCreateNote = () => {
    isCreating.value = true
    selectedNoteId.value = null
}

const cancelCreate = () => {
    isCreating.value = false
}

const handleNoteCreated = async () => {
    isCreating.value = false
    await notesStore.fetchNotes()

    // Выбираем последнюю созданную заметку
    if (notesStore.notes[0]) {
        selectedNoteId.value = notesStore.notes[0].id
        await notesStore.fetchNoteById(notesStore.notes[0].id)
    }
}

const selectNote = async (noteId: number) => {
    selectedNoteId.value = noteId
    isCreating.value = false
    await notesStore.fetchNoteById(noteId)
}

const deleteNote = async (noteId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
        await notesStore.deleteNote(noteId)
        if (selectedNoteId.value === noteId) {
            selectedNoteId.value = null
        }
    }
}
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Заголовок -->
            <header class="mb-8 text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">Мои заметки</h1>
                <p class="text-gray-600">Организуйте свои мысли и идеи в одном месте</p>
            </header>

            <!-- Основной контент -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Панель категорий -->
                <div class="lg:col-span-1">
                    <CategorySidebar />
                </div>

                <!-- Сплиттер с заметками и редактором -->
                <div class="lg:col-span-3 bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="h-[600px] flex">
                        <!-- Список заметок -->
                        <div class="w-1/3 border-r border-gray-200 p-6">
                            <NotesList @create-note="showCreateNote" @note-selected="selectNote"
                                @note-deleted="deleteNote" />
                        </div>

                        <!-- Редактор заметки -->
                        <div class="flex-1 p-6">
                            <CreateNote v-if="isCreating" @created="handleNoteCreated" @cancel="cancelCreate" />
                            <EditNote v-else-if="selectedNoteId" :note-id="selectedNoteId" @delete="deleteNote" />
                            <div v-else class="h-full flex items-center justify-center text-gray-500">
                                <div class="text-center">
                                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p class="text-lg">Выберите заметку для редактирования</p>
                                    <p class="text-sm mt-2">или создайте новую</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
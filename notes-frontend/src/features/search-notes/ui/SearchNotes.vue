<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotesStore } from '@/entities/note'
import { NoteLoader } from '@/shared'

const notesStore = useNotesStore()
const { searchQuery } = storeToRefs(notesStore)

const localQuery = ref(searchQuery.value)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let searchTimeout: any = null

const isSearching = ref(false)

// Следим за изменениями в store
watch(searchQuery, (newValue) => {
    if (newValue !== localQuery.value) {
        localQuery.value = newValue
    }
})

const handleInput = () => {
    // Дебаунс поиска - ждем 500ms после последнего ввода
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    isSearching.value = true
    searchTimeout = setTimeout(async () => {
        await notesStore.setSearchQuery(localQuery.value)
        isSearching.value = false
    }, 500)
}

const clearSearch = () => {
    localQuery.value = ''
    notesStore.setSearchQuery('')
    isSearching.value = false
}
</script>

<template>
    <div class="relative">
        <div class="relative">
            <input v-model="localQuery" type="text" placeholder="Поиск по заметкам..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                @input="handleInput" />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <button v-if="localQuery" @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Индикатор поиска -->
        <div v-if="isSearching"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
            <div class="flex items-center justify-center text-gray-500">
                <NoteLoader class="w-4 h-4 mr-2" />
                Поиск...
            </div>
        </div>
    </div>
</template>
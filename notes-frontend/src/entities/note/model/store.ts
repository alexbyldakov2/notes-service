import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient, type Note, type CreateNoteRequest, type UpdateNoteRequest, type GetNotesParams } from '@/shared/api/client';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([]);
    const currentNote = ref<Note | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const searchQuery = ref<string>('');

    const filteredNotes = computed(() => {
        let filtered = notes.value;

        // Поиск (клиентская фильтрация как fallback)
        if (searchQuery.value.trim()) {
            const query = searchQuery.value.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
            );
        }

        return filtered;
    });

    const setSearchQuery = (query: string) => {
        searchQuery.value = query;
        // При изменении поиска выполняем поиск на сервере
        performSearch();
    };

    const performSearch = async () => {
        const params: GetNotesParams = {};

        if (searchQuery.value.trim()) {
            params.search = searchQuery.value;
        }

        await fetchNotes(params);
    };

    const fetchNotes = async (params?: GetNotesParams) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get<Note[]>('/notes', { params });
            notes.value = response.data;
        } catch (err) {
            error.value = 'Failed to fetch notes';
            console.error('Error fetching notes:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchNoteById = async (id: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get<Note>(`/notes/${id}`);
            currentNote.value = response.data;
        } catch (err) {
            error.value = 'Failed to fetch note';
            console.error('Error fetching note:', err);
        } finally {
            isLoading.value = false;
        }
    };

    const createNote = async (noteData: CreateNoteRequest) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiClient.post<Note>('/notes', noteData);
            notes.value.push(response.data);
            return response.data;
        } catch (err) {
            error.value = 'Failed to create note';
            console.error('Error creating note:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateNote = async (id: number, noteData: UpdateNoteRequest) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiClient.patch<Note>(`/notes/${id}`, noteData);
            const index = notes.value.findIndex(note => note.id === id);
            if (index !== -1) {
                notes.value[index] = response.data;
            }
            if (currentNote.value?.id === id) {
                currentNote.value = response.data;
            }
            return response.data;
        } catch (err) {
            error.value = 'Failed to update note';
            console.error('Error updating note:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteNote = async (id: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            await apiClient.delete(`/notes/${id}`);
            notes.value = notes.value.filter(note => note.id !== id);
            if (currentNote.value?.id === id) {
                currentNote.value = null;
            }
        } catch (err) {
            error.value = 'Failed to delete note';
            console.error('Error deleting note:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        notes: filteredNotes,
        allNotes: notes,
        currentNote,
        isLoading,
        error,
        searchQuery,
        fetchNotes,
        fetchNoteById,
        createNote,
        updateNote,
        deleteNote,
        setSearchQuery,
        performSearch,
    };
});
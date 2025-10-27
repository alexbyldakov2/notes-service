<script setup lang="ts">
import NotesPage from '@/pages/notes/ui/NotesPage.vue'
</script>

<template>
  <div id="app">
    <NotesPage />
  </div>
</template>

<style>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Кастомные стили для скроллбара */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

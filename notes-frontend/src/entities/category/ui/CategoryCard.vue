<script setup lang="ts">
import type { Category } from '../model/types'

interface Props {
    category: Category
    isSelected: boolean
    noteCount?: number
}

defineProps<Props>()
defineEmits<{
    selected: []
}>()
</script>

<template>
    <div :class="[
        'p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2',
        category.color,
        isSelected
            ? 'border-white ring-4 ring-white ring-opacity-50 shadow-2xl'
            : 'border-transparent shadow-lg hover:border-white hover:border-opacity-30'
    ]" @click="$emit('selected')">
        <div class="text-white font-semibold text-lg text-center drop-shadow-md">
            {{ category.name }}
        </div>
        <div v-if="noteCount !== undefined" class="text-white text-opacity-80 text-sm text-center mt-2">
            {{ noteCount }} заметок
        </div>
    </div>
</template>
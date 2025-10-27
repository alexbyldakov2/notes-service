<script setup lang="ts">
interface Props {
    modelValue: string
    placeholder?: string
    error?: boolean
}

defineProps<Props>()
defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <input :value="modelValue" :class="[
        'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
        { 'border-red-500 focus:ring-red-500': error }
    ]" :placeholder="placeholder" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
</template>
<script setup lang="ts">
interface Props {
    modelValue: string
    placeholder?: string
    rows?: number
    error?: boolean
}

withDefaults(defineProps<Props>(), {
    rows: 4,
    error: false
})

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <textarea :value="modelValue" :class="[
        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none',
        { 'border-red-500 focus:ring-red-500': error }
    ]" :placeholder="placeholder" :rows="rows"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
</template>
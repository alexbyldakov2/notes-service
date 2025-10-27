<script setup lang="ts">
defineEmits<{
  click: []
}>()

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantClasses = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
  danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
}

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3'
}
</script>

<template>
  <button :class="[
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantClasses,
    sizeClasses,
    { 'opacity-50 cursor-not-allowed': disabled }
  ]" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>
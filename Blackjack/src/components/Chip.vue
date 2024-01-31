<template>
  <img
    :src="chipsFolder + chipValue + '.png'"
    :alt="chipValue + 'Chip'"
    @click="$emit('chipClicked', chipValue)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  chipValue: number
  chipsFolder: string
}>()
</script>

<style scoped></style>

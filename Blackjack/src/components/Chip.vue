<template>
  <img
    :src="chipsFolder + chipValue + '.png'"
    alt="5 Chip"
    @click="$emit('chipClicked', chipValue)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  chipValue: number
  chipsFolder: string
}>()
const string = ref('')
</script>

<style scoped></style>

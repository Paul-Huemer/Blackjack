<template>
  <img :src="chipsFolder + chipValue + '.png'" alt="5 Chip"/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  chipValue: number
  chipsFolder: string
}>()
const number = ref('')
const string = ref('')
</script>

<style scoped>

</style>
<template>
  <main id="ViewContainer">
    <StartScreen v-if="playState === 1" />
    <PlayScreen v-if="playState === 2" />
    <EndScreen v-if="playState === 3" />
  </main>
</template>

<script setup lang="ts">
import StartScreen from '@/Screens/StartScreen.vue'
import PlayScreen from '@/Screens/PlayScreen.vue'
import EndScreen from '@/Screens/EndScreen.vue'

let playState = 2
</script>

<style lang="scss"></style>

<template>
  <main id="ViewContainer">
    <StartScreen v-if="playState === 1" @play-button-pressed="depositToMoney" />
    <PlayScreen v-if="playState === 2" :start-money="startMoney" @play-finished="moneyToScore" />
    <EndScreen v-if="playState === 3" :score="score" :start-money="startMoney" @return="playStateChange(1)" />
  </main>
</template>

<script setup lang="ts">
import StartScreen from '@/Screens/StartScreen.vue'
import PlayScreen from '@/Screens/PlayScreen.vue'
import EndScreen from '@/Screens/EndScreen.vue'

import { ref } from 'vue'

let startMoney = ref(0)

let score = ref(0)
let playState = ref(1)

const depositToMoney = (deposit: any) => {
  startMoney.value = deposit.value;
  playStateChange(2);
}

const moneyToScore = (money: number) => {
  score.value = money - startMoney.value
  playStateChange(3)
}

const playStateChange = (playStateNum: any) => {
  playState.value = playStateNum
}
</script>

<style lang="scss"></style>

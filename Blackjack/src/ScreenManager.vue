<template>
  <main id="ViewContainer">
    <StartScreen v-if="playState === 1" @play-button-pressed="playStateChange(2)" />
    <PlayScreen v-if="playState === 2" :start-money="startMoney" @play-finished="moneyToScore"/>
    <EndScreen v-if="playState === 3" :score="score" @return="playStateChange(1)"/>
  </main>
</template>

<script setup lang="ts">
import StartScreen from '@/Screens/StartScreen.vue'
import PlayScreen from '@/Screens/PlayScreen.vue'
import EndScreen from '@/Screens/EndScreen.vue'

import { ref } from 'vue'

const startMoney = 200;

let score = ref(0);
let playState = ref(1);

const moneyToScore = (money) => {
  console.log(money);
  score.value = money - startMoney;
  playStateChange(3);
}

const playStateChange = (playStateNum) => {
  playState.value = playStateNum;
}

</script>

<style lang="scss"></style>

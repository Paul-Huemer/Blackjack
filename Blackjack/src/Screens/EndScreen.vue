<template>
  <div class="gameContainer">
    <h1 v-if="score <= (startMoney*-1)" class="score" id="gameOver">Game over.</h1>
    <h1 v-if="score >= 0" class="score" id="gameOver">Congratulations!</h1>
    <h1 class="score">Score: {{score}}</h1>
    <button id="return" @click="emit('return')">Return to Menu</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['return'])

const props = defineProps<{
  score: number
  startMoney: number
}>()
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: Roboto;
}

.gameContainer {
  width: calc(100%);
  height: calc(100%);
  background-color: #528045;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.score {
  color: white;
  margin: 0.3rem;
}

#gameOver {
  margin-bottom: 5rem;
  font-size: 35pt;
}

#return {
  padding: 0.5rem 0.7rem;
  background-color: #b58962;
  border: 0.2rem solid #2c1807;
  border-radius: 0.5rem;
  margin: 0.3rem;
  align-self: center;
  font-size: 12pt;
  font-weight: bold;
}

</style>

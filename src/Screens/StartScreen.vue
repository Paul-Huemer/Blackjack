<template>
  <div class="gameContainer">
    <h1 id="score">
      Welcome to <br />
      Blackjack
    </h1>
    <form>
      <button id="playButton" @click="startGame">Play!</button>
      <label id="depositLabel">Deposit:</label>
      <input type="number" id="depositInput" v-model="deposit" @input="checkMinMaxDeposit">
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['playButtonPressed'])
let deposit = ref();

const startGame = () => {
  if (deposit.value > 0) {
    emit('playButtonPressed', deposit);
  }
}
const checkMinMaxDeposit = () => {
  if (deposit.value < 0) {
    deposit.value = 0;
  }
  if (deposit.value > 1000) {
    deposit.value = 1000;
  }
}
</script>

<style lang="scss">
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

#score {
  color: white;
  margin: 0.3rem;
}

#playButton {
  padding: 0.5rem 0.7rem;
  background-color: #b58962;
  border: 0.2rem solid #2c1807;
  border-radius: 0.5rem;
  margin: 0.3rem;
  align-self: center;
  font-size: 12pt;
  font-weight: bold;
}

#depositLabel {
  color: white;
  margin: 0.3rem;
  font-size: 16pt;
  font-weight: bold;
  display: block;
}

#depositInput {
  height: 2rem;
  font-size: 16pt;
  text-align: center;
  border-radius: 0.5rem;
}
</style>
